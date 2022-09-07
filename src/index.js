const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const  LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const checkAuth = require('./middleware/checkAuth.js');
const MongoDbContenedor = require('./contenedor/contenedor.js');
const { Server : HttpServer } = require('http');
const { Server : SocketServer }  = require('socket.io');
const dotenv = require('dotenv/config');
const minimist = require("minimist");
const process = require('process');
const { fork } = require('child_process');
const userRoutes = require('./routes/users.routes.js');
const productsTest = require('./routes/productsTest.js');
const infoRoutes = require('./routes/info.routes.js');
const cluster = require('cluster');
const os = require('os');
const isMaster = cluster.isMaster;
const numCPUS = os.cpus().length;


const args = minimist(process.argv.slice(2), {
    default:{
        PORT: 8080,
        'modo':'FORK'
    },
    alias:{
        p:'PORT'
    }
})

app.use(
    express.static(path.resolve(__dirname, '../public/'))
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('views'));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'))

let products;
let messages;
let users;

async function connectMongo() {
    try {
        const mongo = new MongoClient(process.env.MongoDB);
        products = new MongoDbContenedor(mongo, 'ecommerce', 'products');
        messages = new MongoDbContenedor(mongo, 'ecommerce', 'messages');
        users = new MongoDbContenedor(mongo, 'ecommerce', 'users');
        await mongo.connect();
        return { products, messages, users};
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}
connectMongo();

passport.use('register', new LocalStrategy(
    async (username, password, done) =>{
        //const aa = await users.getAll()
        const user = await users.findUser(username);
        if(user) return done(null, false, console.log('usuario existente'));
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = {username, password: hash}
        await users.save(newUser);
        done(null, newUser);
    }
));

passport.use('auth', new LocalStrategy(
    async(username, password, done) =>{
        //const allUsers = users.getAll();
        const user = await users.findUser(username);
        if(!user || !bcrypt.compareSync(password, user.password)) return done(null, false, console.log('usuario o contraseña incorrectas'));
        done(null, user);
    } 
));

passport.serializeUser((usuario, callback) =>{
    callback(null, usuario.username);
});

passport.deserializeUser(async (username, callback)=>{
    const allUsers = await users.getAll();
    const user = await users.findUser(username);
    callback(null, user);
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MongoDB,
    }),
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 10 * 1000,
    },
    saveUninitialized: true,
    rolling: true
}))

app.use(passport.session());
app.use(passport.initialize());

app.get('/productos',checkAuth, async (req,res)=> {
    //const userName = req.session.passport.user
    const prods = await products.getAll();
    const msgs = await messages.getAll();
    res.render('formulario', { prods, msgs })
});

app.use('/', userRoutes);
app.use('/productos-test', productsTest);
app.use('/info', infoRoutes);
app.get('/api/randoms', (request, response) => {
    const randomNumber = fork('./child.js');
    
    randomNumber.send(request.query);
    randomNumber.on('message', numerosRandom => {
        response.end(`Numeros random ${JSON.stringify(numerosRandom)}`);
    });
});
// /randoms?cant=20000
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
    socket.emit('products', await products.getAll());
    socket.emit('messages', await messages.getAll());

    socket.on('new_message', async (message) =>{
        try{
            console.log(message);
            await messages.save(message);
            let msgs = await messages.getAll();
            socketServer.sockets.emit('messages', msgs);
        }catch(error){
            console.log(error);
        }
    });

    socket.on('new_product', async (product) => {
        try{
            await products.save(product);
            let prods = await products.getAll();
            socketServer.sockets.emit('products', prods);
        }catch (error){
            console.log(error);
        }
    });
});

app.use((req, res) => {
    res.json({
        error:'-2', 
        description: `ruta ${req.originalUrl} metodo ${req.method} no implementada` 
    });
});

if(args.mod === 'CLUSTER' && isMaster){
    for(let i = 0; i < numCPUS; i++){
        cluster.fork();
    };
    cluster.on('exit', (worker)=>{
        console.log(`Worker con PID ${worker.process.pid}`);
    });
}else {
    httpServer.listen(args.PORT, () =>{
        console.log(`Servidor corriendo en el puerto ${args.PORT}`);
    })
};
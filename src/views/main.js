const socket = io();

const enviarProducto= (e) =>{
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;

    const product = { title: title, price: price, thumbnail: thumbnail };
    socket.emit('new_product', product);

    return false 
} 

const crearEtiquetaProducto = (product) =>{
    const { title, price, thumbnail } = product;
    return`
    <tr>
        <td>${title}</td>
        <td>${price}</td>
        <td><img style="width: 50px; height:50px" src=${thumbnail} alt=${title}></td>
    </tr> `
};

const agregarProductos = (products) =>{
    const finalProductos = products.map(element => crearEtiquetaProducto(element)).join('');
    document.getElementById('productsTable').innerHTML = finalProductos
};

socket.on('productos',(products)=> agregarProductos(products));


//****** MENSAJES  ******/


const enviarMensaje = (e) =>{
    const email = document.getElementById('email').value;
    const text = document.getElementById('text').value;
    const time = new Date();
    
    const message = {email: email, text: text, time: time};
    socket.emit('new_message', message)

    return false
};

const crearEtiquetaMensaje = (message) =>{
    const { email, text, time } = message

    return `
    <div>
        <strong style="color:blue">${email}  </strong>
        <sm style="color:brown">${time}  :  </sm>
        <em style="color:green">${text}    </em>
    </div>
    `;
};

const agregarMensajes = (messages) =>{
    const mensajeFinal = messages.map(element => crearEtiquetaMensaje(element)).join('');
    document.getElementById('messagesTable').innerHTML = mensajeFinal
};

socket.on('mensajes',(messages)=> agregarProductos(messages));
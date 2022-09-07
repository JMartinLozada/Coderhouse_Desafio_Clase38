

module.exports = {
    renderRegister:  ( req, res) =>{
        res.render('register')
    },

    registerPost:  async(req, res)=>{
        res.redirect('/')
    },

    registerFail: (req, res) => {
        res.render('registerFail',{error: true})
    },

    renderLogin: ( req, res ) => {
        res.render('login')
    },

    loginPost:  ( req, res ) => {
        res.redirect('/productos')
    },

    loginFail: (req, res) => {
        res.render('loginFail')
    },

    logout: ( req, res ) => {
        const userName = req.session.passport.user;
        if(req.session.passport.user){
            req.logout( function(err){
                if(err) { return next(err) }
                res.render('logout', {
                    userName
                })
            });
        };
    }
}
const fkr = require('../faker/faker.js');

module.exports = {
    random: (req,res)=> {
        const list = fkr();
        res.render('productos-test', {list})
    }
};
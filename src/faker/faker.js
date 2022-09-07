const { faker } = require('@faker-js/faker');

function generateRandomProducts() {
    const listProd = [];
    for (let index = 0; index < 5; index++) {
        
        const prod = {
            id : index + 1 ,
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            url: faker.image.imageUrl()
        }
        listProd.push(prod)
    }
    return listProd
}

module.exports = generateRandomProducts;
const getRandomNumbers = (cant) => {
    let numbers = [];

    for (let i=0; i<cant; i++){
        let random_numb = Math.floor(Math.random() * (1000 - 1) + 1);

        const findNumber = numbers.find(item => {
            return item.number === random_numb;
        })

        const findIndex = numbers.findIndex(item => {
            return item.number === random_numb;
        })

        if(!findNumber){
            numbers.push({number: random_numb, cantidad: 1})
        } else {
            let cantidad = numbers[findIndex].cantidad;
            numbers[findIndex].cantidad = cantidad+1;
        }
    }

    return numbers;
}

process.on('message', req => {
    const {cant} = req;

    if(!cant) {
        let numerosRandom = getRandomNumbers(100000000);
        process.send(numerosRandom);
    }

    let numerosRandom = getRandomNumbers(cant);
    process.send(numerosRandom);
})
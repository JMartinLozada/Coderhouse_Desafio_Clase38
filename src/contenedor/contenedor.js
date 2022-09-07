class MongoDbContenedor {
    constructor(mongo, db, coll){
        this.db = db;
        this.coll = coll;
        this.mongo = mongo;
    }

    async save(object){
        try{
            const res = await  this.mongo.db(this.db).collection(this.coll).insertOne(object);
            return res
        }catch(error){
            console.log(error);
        }
    }

    async getAll() {
        try{
            const allCollection = await  this.mongo.db(this.db).collection(this.coll).find().toArray();
            return allCollection
        }catch(error){
            console.log(error);
        }
    }

    async findUser(username) {
        try {
            const allCollection = await this.getAll();
            const document = allCollection.find(element => element.username === username);
            return document;
        }
        catch {

        }
    }
};

module.exports = MongoDbContenedor;
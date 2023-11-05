const mongoose = require("mongoose")


const MongoUrl = "mongodb+srv://ohhyesvishu:GiGsdoefpXjetXYt@cluster0.jkv2qaj.mongodb.net/test"


const InitiateMongoServer = async ()=>{
    try{
        await mongoose.connect(MongoUrl,{
            useNewUrlParser:true
        });
        console.log("connected to db")
    }
    catch(e){
        console.log(e)
        throw e
    }
}

module.exports = InitiateMongoServer

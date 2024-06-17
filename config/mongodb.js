const mongoose= require("mongoose");
const MONGO_CONFIG= require("./config").MONGO_DB;

function ConnectToDb() {
    mongoose.connect(MONGO_CONFIG.CONN_URL);

    mongoose.connection.on("connected", ()=>{
        console.log("MongoDb connected successfully.");
    });

    mongoose.connection.on("error", (err)=>{
        console.log("MongoDb connection failed.");
        console.log(err);
    });

}

module.exports= ConnectToDb;

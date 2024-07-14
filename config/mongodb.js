const mongoose= require("mongoose");
const MONGO_CONFIG= require("./config").MONGO_DB;
const logger= require('../logging/logger');

function ConnectToDb() {
    mongoose.connect(MONGO_CONFIG.CONN_URL);

    mongoose.connection.on("connected", ()=>{
        logger.info("MongoDb connected successfully.");
    });

    mongoose.connection.on("error", (err)=>{
        logger.error("MongoDb connection failed.");
        logger.error(err);
    });

}

module.exports= ConnectToDb;

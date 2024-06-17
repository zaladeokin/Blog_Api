require("dotenv").config();

module.exports= {
    PORT: process.env.PORT,
    AUTHOR_CONTACT:{
        email: process.env.EMAIL,
        phone_number: process.env.PHONE_NUMBER,
        linkedin: process.env.LINKEDIN
    },
    MONGO_DB:{
        CONN_URL: process.env.CONN_URL,
        JWT_SECRET: process.env.JWT_SECRET
    }
}
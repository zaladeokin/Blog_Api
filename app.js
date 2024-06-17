const express= require("express");
const bodyParser= require("body-parser");

const authRouter= require("./routes/auth");
const userRouter= require("./routes/user");

const CONFIG= require("./config/config");
connectToMongoDb= require("./config/mongodb");

 // Signup and login authentication middleware
require("./authentication/auth")

//Connect to MongoDB
connectToMongoDb();

const app= express();

// Add middleware
// app.use(bodyParser.urlencoded({ extended: false }))// parse application/x-www-form-urlencoded :: Access form value by name.
app.use(bodyParser.json())// parse application/json

//Add Route
app.use("/api/v1/auth", authRouter);//Authentication routes
app.use("/api/v1/users", userRouter);//User routes

app.get("/", (req, res)=>{
    res.json({
        success: true,
        about: "Blog-api has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users.",
        contact: CONFIG.AUTHOR_CONTACT
    })
});

//Catch all undefine routes
app.get("*", (req, res)=>{
    res.status(404);
    res.json({
        success: false,
        message: "Route does not exist."
    })
});

//Error handler middleware
app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    res.status(errorStatus);
    delete err.status;
    res.json(err)
    next();
});

//Start server
app.listen(CONFIG.PORT, ()=>{
    console.log(`Server started successfully on port ${CONFIG.PORT}`);
}); 
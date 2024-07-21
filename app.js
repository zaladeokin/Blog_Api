const express= require("express");
const bodyParser= require("body-parser");
const { rateLimit }=require('express-rate-limit');
const helmet = require('helmet');
const httpLogger= require('./logging/httpLogger')

const logger= require('./logging/logger');//Log info and error

const authRouter= require("./routes/auth");
const userRouter= require("./routes/user");
const blogRouter= require("./routes/blog");

const CONFIG= require("./config/config");
connectToMongoDb= require("./config/mongodb");

 // Signup and login authentication middleware
require("./authentication/auth");

//Connect to MongoDB
connectToMongoDb();

const app= express();

// Add middleware

//Log http request.
app.use(httpLogger);

//HTTP Security Middleware
app.use(helmet());

//Request Rate limit
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: "Uh.. Too many request, try again after some minutes.",
    handler: (req, res, next, options)=>{
        next({
            status: options.statusCode,
            success: false,
            message: options.message
        });
    }
});
app.use(limiter); // Apply the rate limiting middleware to all requests.

// app.use(bodyParser.urlencoded({ extended: false }))// parse application/x-www-form-urlencoded :: Access form value by name.
app.use(bodyParser.json())// parse application/json

//Add Route
app.use("/api/v1/auth", authRouter);//Authentication routes
app.use("/api/v1/users", userRouter);//User routes
app.use("/api/v1/blogs", blogRouter);//Blog routes

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
    logger.error(err);
    const errorStatus = err.status || 500;
    res.status(errorStatus);
    delete err.status;
    delete err.level;
    res.json(err)
    next();
});

//Start server
app.listen(CONFIG.PORT, ()=>{
    logger.info(`Server started successfully on port ${CONFIG.PORT}`);
}); 
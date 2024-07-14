const express = require('express');
const passport = require('passport');
const UserValidationMW= require("../validators/user_validator");
const userController = require("../controllers/user_controller");

const userRouter= express.Router();

// Authentication handler.
const authHandler= require("../authentication/authMW");

// Get all Users
userRouter.get("/", userController.getAllUsers);

// Get User by Id
userRouter.get("/:id", userController.getUserById);

// Create User
userRouter.post("/", UserValidationMW.AddUserValidationMW, userController.addUser);

// Update User Info
userRouter.put("/:id", authHandler, UserValidationMW.UpdateUserValidationMW, userController.updateUser);


module.exports = userRouter;
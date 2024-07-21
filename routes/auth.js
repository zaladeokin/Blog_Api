const express = require('express');
const UserValidationMW= require("../validators/user_validator");
const authController = require("../controllers/auth_controller");

const authRouter = express.Router();

//Login a user
authRouter.post('/login', UserValidationMW.LoginValidationMW, authController.Login);

//Other Route
//authRouter.get('reset')// reset password request to email
//authRouter.post('reset')// reset password process
//authRouter.post('change_password')// change password process

module.exports = authRouter;
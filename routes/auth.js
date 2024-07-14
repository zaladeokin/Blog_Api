const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWT_SECRET= require("../config/config").MONGO_DB.JWT_SECRET;
const UserValidationMW= require("../validators/user_validator");

const authRouter = express.Router();

authRouter.post(
    '/login', UserValidationMW.LoginValidationMW,
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next({
                        status: 400,
                        success: false,
                        message: err
                    });
                }
                if (!user) {
                    return next({
                        status: 400,
                        success: false,
                        message: info
                    });
                }
                

                req.login(user, { session: false },
                    async (err) => {
                        if (err) return next({
                            status: 400,
                            success: false,
                            message: err
                        });

                        const body = { _id: user._id };
                        //You store the id, email, etc in the payload of the JWT. 
                        // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                        // DO NOT STORE PASSWORDS IN THE JWT!
                        const token = jwt.sign({ user: body }, JWT_SECRET, {expiresIn : '1h'});

                        return res.json({
                            success: true,
                            message: info,
                            token: token
                        });
                    }
                );
            } catch (err) {
                return next({
                    status: 500,
                    success: false,
                    message: err
                });
            }
        }
        )(req, res, next);
    }
);

//Other Route
//authRouter.get('reset')// reset password request to email
//authRouter.post('reset')// reset password process
//authRouter.post('change_password')// change password process

module.exports = authRouter;

// try{//Model might throw error 
        
//     }catch(err){
//         next({
//             status: 400,
//             success: false,
//             message: err
//         });
//     }
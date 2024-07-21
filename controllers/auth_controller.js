const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWT_SECRET= require("../config/config").MONGO_DB.JWT_SECRET;

async function Login(req, res, next){
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
            req.login(user, { session: false }, async (err) => {
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
                    });
        } catch (err) {
            return next({
                status: 500,
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

module.exports ={
    Login
}

// try{//Model might throw error 
        
//     }catch(err){
//         next({
//             status: 400,
//             success: false,
//             message: err
//         });
//     }
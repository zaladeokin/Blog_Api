const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const JWT_SECRET= require("../config/config").MONGO_DB.JWT_SECRET;


passport.use(
    new JWTstrategy(
        {
            secretOrKey: JWT_SECRET,
            // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // Use this if you are using Bearer token
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (err) {
                done(err);
            }
        }
    )
);


// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    return done(null, false, 'User not registered, Kindly signup.');
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, 'Username or password is incorrect.');
                }

                return done(null, user, 'Logged in Successfully.');
            } catch (err) {
                return done(err);
            }
        }
    )
);
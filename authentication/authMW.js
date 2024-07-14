const passport = require('passport');

// Authentication handler.
function authHandler(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, Info){
        if(err || !user) return next({
            status: 401,
            success: false,
            message: "You're unathorized for this action, Kindly Login or Register."
         });
         req.user= user;
         next();
    })(req, res, next);
}

module.exports = authHandler;
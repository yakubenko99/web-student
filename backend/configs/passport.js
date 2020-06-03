const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require("passport-local");
const bcrypt = require('bcryptjs');
const UserModel = require('../models/users');


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: 'jwtsecret'
};
passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        UserModel.getUserByEmail(email)
            .then(async (user) => {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                else {
                    return done(null, user);
                }
            })
            .catch((error) => {
                console.log(error);
                return done(null, false, { message: 'Incorrect email.' });
            })
    }
));
passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
    UserModel.getUserById(payload)
        .then((user) => {
            return done(null, user);
        })
        .catch((err) => {
            return done(err);
        })

}));

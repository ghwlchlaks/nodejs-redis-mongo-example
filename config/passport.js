const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
    }, (username, password, done) => {
        Users.findOne({username: username}, (findError, user) => {
            if (findError) return done(findError);
            if (!user) return done(null, false, {message: '존재하지않는 아이디'});
            if (!user.comparePassword(password, user.password)) return done(null, false, {message: '비밀번호가 다릅니다.'});
            return done(null, user);
        })
    }))
    passport.use('signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        Users.findOne({username: username}, (findError, user) => {
            if (findError) return done(findError);
            if (user) return done(null, false, {message: '존재하는 아이디입니다.'});
            const newUser = new Users();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.save((saveError) => {
                if(saveError) throw saveError;
                return done(null, newUser);
            })
        }) 
    }))
}
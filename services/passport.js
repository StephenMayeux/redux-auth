const passport = require('passport');
const config = require('../config');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify username and password and call done
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Set up options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create Jwt Strategy
// payloaded is decoded token
const JwtLogin  = new JwtStrategy(jwtOptions, function(payload, done) {
  // check if user exists in DB. If so, call done with user object.
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    return user ? done(null, true) : done(null, false);
  });
});

// Tell passport to use this strategy
passport.use(JwtLogin);
passport.use(localLogin);

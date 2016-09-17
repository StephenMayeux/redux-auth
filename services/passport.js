const passport = require('passport');
const config = require('../config');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Set up options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create Jwt Strategy
// payloaded is decoded token
const JwtLogin  = new JwtStrategy(jwtOptions, fucntion(payload, done) {
  // check if user exists in DB. If so, call done with user object.
  User.findById(payload.sub, function(err, user) {
    if (err) return { done(err, false); }

    return user ? done(null, true) : done(null, false);
  });
});

// Tell passport to use this strategy
passport.use(JwtLogin);

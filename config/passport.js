const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require("./keys").secretOrKey;
// opts.issuer = "accounts.examplesoft.com";

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id).then(user => {
        if (user) {
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          };
          return done(null, payload);
        } else {
          return done(null, false);
        }
      });
    })
  );
};

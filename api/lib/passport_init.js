var mon           = require('mongoman');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy
var Err           = require('./error').errorGenerator;


module.exports = function (server) {
  var User = mon.model('User');

  //////////////////////////////////////////////////////////////////////////////////
  //
  // init
  //
  //////////////////////////////////////////////////////////////////////////////////

  server.use(passport.initialize());
  server.use(passport.session());


  //////////////////////////////////////////////////////////////////////////////////
  //
  // serializing
  //
  //////////////////////////////////////////////////////////////////////////////////


  passport.serializeUser(function (user, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
      return done(error, user);
    });
  });


  //////////////////////////////////////////////////////////////////////////////////
  //
  // strategies
  //
  //////////////////////////////////////////////////////////////////////////////////


  // signup
  //
  passport.use('signup', new LocalStrategy({
    usernameField     : 'email',
    passReqToCallback : true
  }, function (req, email, password, done) {
    function findOrCreateUser () {
      User.findOne({ 'email' : email }, function (error, user) {
        if (error) {
          return done(error);

        // user exists
        } else if (user) {
          return done(null, false, 'A user with that email exists');

        // create the user
        } else {
          mon.save('User', req.body, done, function (newUser) {
            return done(null, newUser);
          });
        }
      });
    };

    process.nextTick(findOrCreateUser);
  }));

  // login
  //
  passport.use('login', new LocalStrategy({
    usernameField     : 'email',
    passReqToCallback : true
  },function (req, email, password, done) {
    User.findOne({ 'email' :  email }, function (error, user) {
        if (!(user && user.comparePassword(password))){
          return done(null, false, 'No email/password combination found');
        } else {
          return done(null, user);
        }
      }
    );
  }));

  //////////////////////////////////////////////////////////////////////////////////
  //
  // helpers
  //
  //////////////////////////////////////////////////////////////////////////////////


  passport.requireSession = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return next(Err('Not logged in', null, 401));
    }
  }


  return passport
}
var mon      = require('mongoman');
var passport = require('passport');
var Err      = require('../../lib/error').errorGenerator;
var _        = require('lodash')

var User = mon.model('User');

module.exports = {


  // Create
  //
  // Form Params:
  // {
  //   name     : String,
  //   email    : String,
  //   password : String,
  // }
  //
  // Returns:
  // [{
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }]
  //
  create : function (req, res, next) {
    passport.authenticate('signup', function (error, user, info) {
      if (error) {
        return next(error);
      } else if (!user) {
        return next(Err(info));
      } else {
        return res.send({
          _id     : user._id,
          name    : user.name,
          email   : user.email,
          created : user.created
        });
      }
    })(req, res, next);
  },


  // Read
  //
  // Query Params:
  // {
  //   q : String, // OPTIONAL - return users that match the name or email
  // }
  //
  // Returns:
  // [{
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }]
  //
  read : function (req, res, next) {

    // perform a search if the query param was provided
    if (req.query.q) {
      // match from the beginning of a word,
      var regEx = new RegExp('(^|\\s+)' + req.query.q,'i');

      User.find({
        $or : [
          { email : regEx },
          { name  : regEx }
        ]
      }, function (error, users) {
        if (error) {
          return next(error);
        } else {
          return res.send({
            users : sanitizeUsers(users)
          });
        }
      });

    // otherwise, get the latest players
    } else {
      User.find({}).sort({
        created : 'descending' // sort from most to least recently created
      }).exec(function (error, users) {
        if (error) {
          return next(error);
        } else {
          return res.send({
            users : sanitizeUsers(users)
          });
        }
      });
    }
  }
};

function sanitizeUsers (users) {
  return _.map(users || [], function (user) {
    return {
      _id     : user._id,
      name    : user.name,
      email   : user.email,
      created : user.created
    }
  })
}
var mon      = require('mongoman');
var passport = require('passport');
var Err      = require('../../lib/error').errorGenerator;
var _        = require('lodash')

// var User = mon.model('User');

module.exports = {


  //////////////////////////////////////////////////////////////////////////////////
  //
  // create
  //
  //////////////////////////////////////////////////////////////////////////////////


  create : function (req, res, next) {
    passport.authenticate('login', function (error, user, info) {
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


  //////////////////////////////////////////////////////////////////////////////////
  //
  // read
  //
  //////////////////////////////////////////////////////////////////////////////////


  read : function (req, res, next) {
    return res.send({ loggedIn : true });
  },


  //////////////////////////////////////////////////////////////////////////////////
  //
  // update
  //
  //////////////////////////////////////////////////////////////////////////////////


  destroy : function (req, res, next) {
    req.logout();
    return res.send({ loggedIn : false });
  }
};
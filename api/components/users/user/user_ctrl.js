var mon = require('mongoman');
var err = require('../../../lib/error').errorGenerator;

var User = mon.model('User');

module.exports = {


  // Create
  //
  // Accepts Body:
  // {
  //   title : String // REQUIRED
  //   content : String // REQUIRED
  // }
  //
  // Returns: //created user
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  create : function (req, res, next) {
    // create a new user with the params provided
    mon.new('User', {
      title   : req.body.title,
      content : req.body.content

    // save the user, we'll let mongoose handle validation defined in our schema
    }).save(function sendUser (error, user) {
      if (error) {
        // if there was a collision in the title submitted
        if (error.code == 11000) {
          return next(err('A user with that title already exists!'));

        } else {
          return next(error);
        }
      } else {
        return res.send(user);
      }
    });
  },


  // Read
  //
  // Returns: // user
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  read : function (req, res, next) {
    User.findOne({
      _id : req.params.id
    }, function sendUser (error, user) {
      // a user with the provided ID is not in the database
      if (!user) {
        return next({
          status : 404,
          error  : 'User `' + req.params.id + '` not found'
        });

      } else {
        return res.send(user);
      }
    });
  },


  // Update
  //
  // Accepts Body:
  // {
  //   title : String // OPTIONAL
  //   content : String // OPTIONAL
  // }
  //
  // Returns: // updated user
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  update : function (req, res, next) {
    User.findOne({
      _id : req.params.id
    }, function updateUser (error, user) {
      // a user with the provided ID is not in the database
      if (!user) {
        return next({
          status : 404,
          error  : 'User `' + req.params.id + '` not found'
        });

      // if the user is in the database, update it
      } else {
        // allow only title and content to be updated individually
        user.title   = req.body.title || user.title;
        user.content = req.body.content || user.content
        user.save(function (err, _user) {
          if (error) {
            return next(error);

          } else {
            return res.send(_user);
          }
        })
      }
    });
  },


  // Destroy
  //
  // Returns: // success or failure
  // {
  //   success : Boolean
  // }
  //
  destroy : function (req, res, next) {
    User.findOne({
      _id : req.params.id
    }).remove(function sendUser (error, user) {
      // a user with the provided ID is not in the database
      if (!user) {
        return next({
          status : 404,
          error  : 'User `' + req.params.id + '` not found'
        });

      } else {
        return res.send({
          success: true
        });
      }
    });
  }
};

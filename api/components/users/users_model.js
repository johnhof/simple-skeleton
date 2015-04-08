var mon    = require('mongoman');
var bcrypt = require('bcrypt-nodejs');

// register a new model `User`
module.exports = mon.register('User', {
  email    : mon('Email').string().unique().email().required().fin(),
  name     : mon('Name').string().required().max(50).fin(),
  password : mon('Password').string().regex( /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/).fin(),
  created  : mon().date().required().default(Date.now).fin(),
}, {

  middleware : {

    // save
    pre : {
      save : function (callback) {
        if (this.isModified('password'))  {
          this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
        }

        return callback();
      }
    }
  },

  methods : {
    //compare password
    comparePassword : function(submitted) {
      return bcrypt.compareSync(submitted, this.password);
    },

    sanitize : function (callback) {
      return {
        _id      : this._id,
        name     : this.name,
        email    : this.email,
        password : this.password
      }
    }
  }
});
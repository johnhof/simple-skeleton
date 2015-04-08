var passInit = require('./lib/passport_init');

exports.register = function register (server) {
  var passport = passInit(server);

  // Users
  var users = require('./components/users/users_ctrl');
  server.post('/users', users.create); // Create
  server.get('/users', users.read); // Read

  // User
  var user = require('./components/users/user/user_ctrl');
  server.get('/users/:id', user.read); // Read

  // Session
  var session = require('./components/session/session_ctrl');
  server.get('/session', passport.requireSession, session.read); // Read
  server.post('/session', session.create); // Create

  server.delete('/session', session.destroy); // Destroy
};
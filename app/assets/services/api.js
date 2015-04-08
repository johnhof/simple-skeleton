
//
// Api
//
// wrapper for simplifying requests to the API
//
SimpleApp.service('Api', ['$http', '$resource', function ($http, $resource) {

  // return a function which thinly wraps the $http object
  var api = function (settings) {
    return $http(settings);
  }

  //
  // Resources
  //

  // Users
  api.users = $resource('/users', null,  {
    create  : { method : 'POST' },
    read    : { method : 'GET' },
  });

  // User
  api.user = $resource('/users/:id', null,  {
    read    : { method : 'GET' }
  });

  // Session
  api.session = $resource('/session', null,  {
    create  : { method : 'POST' },
    read    : { method : 'GET' },
  });

  return api;
}])
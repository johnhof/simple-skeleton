//
// Routing
//

// $routeprovider allows us to define clientside routing
SimpleApp.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.

    // Home
    when('/', {
      templateUrl : 'views/home.html',
      controller  : 'HomeCtrl'
    }).

    // New User
    when('/users/new', {
      templateUrl : 'views/new_user.html',
      controller  : 'NewUserCtrl'
    }).

    // Log In
    when('/login', {
      templateUrl : 'views/login.html',
      controller  : 'LoginCtrl'
    }).


    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });
  }
]);
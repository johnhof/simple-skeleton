//
// App setup
//

// Create our app, using some helpful modules
var SimpleApp = angular.module('SimpleApp', [
  'ngRoute',
  'ngResource',
  'ngDialog'
]);


SimpleApp.run(['$rootScope', '$http', 'ngDialog', 'Api', function ($rootScope, $http, ngDialog, Api) {
  $rootScope.isLoggedIn = false

  $rootScope.logOut = function () {
    Api.session.destroy({}, function () {
      $rootScope.isLoggedIn = false;
    }, function () {
      $rootScope.isLoggedIn = false;
    });
  }

  $rootScope.checkSessionStatus = function () {
    Api.session.read({}, function () {
      $rootScope.isLoggedIn = true;
    }, function () {
      $rootScope.isLoggedIn = false;
    });
  }

  $rootScope.checkSessionStatus();

  // dialogs
  $rootScope.$on( "$routeChangeStart", function (event, next, current) {
    ngDialog.closeAll();
  });
}]);


SimpleApp.constant('Patterns', {
  email    : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password : /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/
});

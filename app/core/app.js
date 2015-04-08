//
// App setup
//

// Create our app, using some helpful modules
var SimpleApp = angular.module('SimpleApp', [
  'ngRoute',
  'ngResource',
  'ngDialog'
]);


SimpleApp.run(['$rootScope', '$http', 'ngDialog', function ($rootScope, $http, ngDialog) {
  // dialogs
  $rootScope.$on( "$routeChangeStart", function (event, next, current) {
    ngDialog.closeAll();
  });
}]);


SimpleApp.constant('Patterns', {
  email    : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password : /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/
});

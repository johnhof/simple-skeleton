//
// Header Controller
//

var headerCtrl = angular.module('SimpleApp').controller('HeaderCtrl', ['$scope', 'Api', function ($scope, Api) {
  $scope.isLoggedIn = false

  $scope.checkSessionStatus = function () {
    Api.session.read({}, function () {
      $scope.isLoggedIn = true;
    }, function () {
      $scope.isLoggedIn = false;
    });
  }

  $scope.checkSessionStatus();


  // handle page load scrolling
  $scope.$on('$routeChangeSuccess', function () {

    // close the open nav bar on route change
    angular.element('.navbar-toggle:not(.collapsed)').trigger('click');
  });
}]);

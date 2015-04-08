//
// Header Controller
//

var headerCtrl = angular.module('SimpleApp').controller('HeaderCtrl', ['$scope', 'Api', function ($scope, Api) {

  // handle page load scrolling
  $scope.$on('$routeChangeSuccess', function () {

    // close the open nav bar on route change
    angular.element('.navbar-toggle:not(.collapsed)').trigger('click');
  });
}]);

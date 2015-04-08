SimpleApp.controller('NewUserCtrl', ['$scope','FormHelper', 'Api', function ($scope, FormHelper, Api) {
  $scope.form = {};

  //
  // uuser submit handling
  //

  $scope.inputs = {
    name     : null,
    email    : null,
    password : null,
  };

  $scope.submit = function () {
    $scope.form.user.success = false;
    FormHelper($scope.form.user).apiAction({
      name     : $scope.inputs.name,
      email    : $scope.inputs.email,
      password : $scope.inputs.password
    }, Api.users.create, function () {
      $scope.form.user.success = 'Thank you!';
    });
  }

}]);
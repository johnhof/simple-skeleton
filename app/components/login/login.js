SimpleApp.controller('LoginCtrl', ['$scope','FormHelper', 'Api', function ($scope, FormHelper, Api) {
  $scope.form = {};

  //
  // session submit handling
  //

  $scope.inputs = {
    email    : null,
    password : null,
  };

  $scope.submit = function () {
    $scope.form.login.success = false;
    FormHelper($scope.form.login).apiAction({
      email    : $scope.inputs.email,
      password : $scope.inputs.password
    }, Api.session.create, function () {
      $scope.form.login.success = 'Successful Login!';
    });
  }

}]);
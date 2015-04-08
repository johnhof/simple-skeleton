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

////////////////////////////////////////////////////////////////////////
//
//  Custom Validators
//
////////////////////////////////////////////////////////////////////////


SimpleApp.directive('number', [function () {
  return {
    restrict : 'A',
    link     : function(scope, element, attrs, ctrl) {
      // prevent non integer values
      element.on('keydown', function (e) {
        var whiteListed = ~_.indexOf([46, 8, 9, 27, 13, 110, 190], e.keyCode);
        whiteListed = whiteListed || (e.keyCode == 65 && e.ctrlKey === true); // Ctrl A
        whiteListed = whiteListed || (e.keyCode >= 35 && e.keyCode <= 40); // Arrows
        whiteListed = whiteListed || (!e.shiftKey && (e.keyCode > 47 && e.keyCode < 58)); // Standard Numbers
        whiteListed = whiteListed || (e.keyCode > 95 && e.keyCode < 106); // Number pad

        // prevent non-whiteListed keypresses
        if (!whiteListed) {
          return e.preventDefault();
        }
      });
    }
  };
}]);



SimpleApp.directive('email', ['Patterns', function (Patterns) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$validators.email = function(modelValue, viewValue) {
        return Patterns.email.test(viewValue);
      };
    }
  };
}]);


SimpleApp.directive('password', ['Patterns', function (Patterns) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$validators.password = function(modelValue, viewValue) {
        return Patterns.password.test(viewValue);
      };
    }
  };
}]);



SimpleApp.directive('match', [function () {
  return {
    require : 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      var $matchInput = element.closest('form').find('input[ng-model="' + attrs.match + '"]');

      // listen for changes on the mathing element, so we can update ourself
      $matchInput.on('keyup', function () {
        delete ctrl.$error.match;

        if (element.val() != $matchInput.val()) {
          ctrl.$error.match = true;
        }

        element.trigger('keyup');
      })

      ctrl.$validators.match = function(modelValue, viewValue) {
        var matchVal = $matchInput.val();
        return matchVal == viewValue;
      };
    }
  };
}]);

////////////////////////////////////////////////////////////////////////
//
//  validate directive
//
////////////////////////////////////////////////////////////////////////

// directive to automatically show any errors bound to the accompanying model (`[name].$error` in a form)
//  error display binds to the `name` attribute
SimpleApp.directive("validate", [function () {
  // build template errors
  function  getErrorMsg (errors) {
    errors = errors.join('|');
    // NOTE: order is IMPORTANT
    var errorList = [
      {
        error   : 'invalid',
        message : 'invalid'
      },
      {
        error   : 'match',
        message : 'does not match'
      },
      {
        error   : 'email',
        message : 'must be valid'
      },
      {
        error   : 'password',
        message : 'must be at least six characters with one number'
      },
      {
        error   : 'required',
        message : 'required'
      }
    ];

    var errorMsg = 'is invalid';
    _.each(errorList, function (errorObj) {
      if (errors.indexOf(errorObj.error) !== -1) {
        errorMsg = errorObj.message;
      }
    });

    return errorMsg;
  };

  return {
    require : 'ngModel',
    link : function(scope, element, attr, ctrl) {
      element.after('<div class="error" data-matches="' + attr.ngModel + '"></div>');
      var $errorDiv =  element.next('.error[data-matches="' + attr.ngModel + '"]');

      element.on('keyup', handleValidation);
      scope.$watch(attr.ngModel, handleValidation, true);

      function handleValidation () {
        var errorsKeys = Object.keys(ctrl.$error || {});
        if (errorsKeys.length) {
          element.addClass('invalid');
          $errorDiv.text(getErrorMsg(errorsKeys));
        } else {
          element.removeClass('invalid');
          $errorDiv.empty();
        }
      }
    },
  };
}]);


// Ripple effect for buttons
//
SimpleApp.directive('ripple', ['Patterns', function (Patterns) {
  return {
    restrict : 'C',
    link     : function(scope, element, attrs, ctrl) {
      element.on('click', function (event) {
        // event.preventDefault();
        var dark = element.hasClass('dark');

        var $div      = $('<div/>');
        var btnOffset = element.offset();
        var xPos      = event.pageX - btnOffset.left;
        var yPos      = event.pageY - btnOffset.top;

        $div.addClass('ripple-effect');
        if (dark) { $div.addClass('dark'); }

        var $ripple = $(".ripple-effect");

        $ripple.css("height", $(this).height());
        $ripple.css("width", $(this).height());

        $div.css({
          top: yPos - ($ripple.height()/2),
          left: xPos - ($ripple.width()/2),
          background: $(this).data("ripple-color")
        }).appendTo($(this));

        window.setTimeout(function(){
          $div.remove();
        }, 1000);
      });
    }
  };
}]);

// add a sprite from the sprite sheet
//
SimpleApp.directive('sprite', [function () {
  return {
    restrict : 'E',
    replace  : true,
    scope    : {
      href : '@',
      name : '@'
    },
    template : '<span class="sprite {{name}} size-{{size}}"  target="__blank"></span>',
    link     : function (scope, element, attrs) {
      scope.href = attrs.href;
      scope.name = attrs.name;
      scope.size = attrs.size || '32';
    }
  };
}]);

//
// Prototype additions
//

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


_.findValue = function (obj, namespace, defaultValue) {
  if (!obj) { return defaultValue; }

  var keys = namespace.split('.').reverse();
  while (keys.length && (obj = obj[keys.pop()]) !== undefined) {}

  return (typeof obj !== 'undefined' ? obj : defaultValue);
}

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
////////////////////////////////////////////////////////////////////////
//
//  Form Helper
//
////////////////////////////////////////////////////////////////////////

SimpleApp.service('FormHelper', ['Spinner', function (Spinner) {
  return function (formObj) {
    var $form = angular.element('form[name="' + formObj.$name + '"]');
    var form  = {
      // validate and perform passed in action
      apiAction : function (inputs, resourceReq, onSuccess, onError) {
        formObj.submitted = true;

        if (form.validate()) {
          Spinner.open();
          resourceReq(inputs, function () {
            Spinner.close();
            onSuccess(arguments)
          }, onError || form.resErrHandler);
        }
      },

      // validate by pairing visible inputs with their angular model counterparts to find validation errors
      validate : function () {
        var inputsArr = form.visibleInputs();
        var valErrors;

        formObj.globalError = null;

        // only validate visible inputs
        _.each(inputsArr, function ($input) {
          var angInput = formObj[$input.attr('name')]; // pair name to angular input obj
          if (angInput && Object.keys(angInput.$error || {}).length) {
            valErrors =  true;
          }
        });

        return !valErrors;
      },

      visibleInputs : function () {
        return _.compact($form.find('input[ng-show]:not(.ng-hide), input:not([ng-show])').map(function () {
          var $input = $(this);
          // make sure our parent isnt hidden either
          if (!$input.closest('[ng-show].ng-hide').length) { return $input; }
        }));
      },

      // error handler which appends api errors to the form
      resErrHandler : function (apiError) {
        var errorObj = _.defaults(apiError.data || {}, {
          error   : 'Failed to complete action',
          details : []
        });

        Spinner.close();

        // if its a validation error, set the error text for each problem input
        if (errorObj.error === 'ValidationError') {
          _.each(errorObj.details, function (valError) {
            if (!(valError && valError.path && valError.message)) { return; }
            var $input = $dom.find('.error[data-matches="' + valError.path + '"], .error[data-matches="inputs.' + valError.path + '"], .error[data-matches="fomr.' + valError.path + '"]');
            $input.text(valError.message.capitalize());
          });

        // if its not a validation error, just display add the error to the form
        } else {
          formObj.globalError = errorObj.error;
        }
      },
    }

    return form;
  }
}]);

// Open and close a loading spinner
//
SimpleApp.service('Spinner', ['ngDialog', function (ngDialog) {
  var instance    = null;
  var defaultSpin = {
    template        : '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
    plain           : true,
    showClose       : false,
    closeByEscape   : false,
    closeByDocument : false,
    className       : 'ngdialog-theme-default spinner-container'
  };

  return {
    open : function () {
      instance = ngDialog.open(defaultSpin);
    },
    close : function () {
      if (instance) {
        instance.close();
      }
    }
  }
}]);
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
}]);

SimpleApp.controller('HomeCtrl', ['$scope', 'Api', function ($scope, Api) {
  $scope.loading = true;
  $scope.users = [];


  //////////////////////////////////////////////////////////////////////////////////
  //
  // event listeners
  //
  //////////////////////////////////////////////////////////////////////////////////

  // define users request
  $scope.search = function (name) {
    console.log('searching')
    Api.users.read({
      q : name
    }, function (result) {
      $scope.users = result.users;
      $scope.loading = false;
    });
  }

  //////////////////////////////////////////////////////////////////////////////////
  //
  // init
  //
  //////////////////////////////////////////////////////////////////////////////////


  // invoke user request
  $scope.search();
}]);
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
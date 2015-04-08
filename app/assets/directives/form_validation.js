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

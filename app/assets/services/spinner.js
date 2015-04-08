
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
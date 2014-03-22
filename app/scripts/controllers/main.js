'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($scope) {
    $scope.message = 'This is the homepage message';
  })
  .controller('AboutCtrl', function ($scope) {
    $scope.message = ['Daniel', 'Zak', 'Huan'];
  })
  .controller('ContactCtrl', function ($scope) {
    $scope.message = 'dparker.tech@gmail.com';
  })
  .controller('UiCtrl', function ($scope) {
  });

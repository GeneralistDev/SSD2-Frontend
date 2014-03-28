'use strict';

angular.module('frontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/ui', {
        templateUrl: 'views/ui.html',
        controller: 'UiCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

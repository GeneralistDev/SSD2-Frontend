'use strict';

// app.js defines what modules will be used for the single page app and also what
// urls route to a given controller. 
angular.module('frontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'frontendApp.directives.attributesPanel', // Directives
  'frontendApp.directives.w2uiLayout',
  'frontendApp.directives.editorGraphPanel',
  'frontendApp.directives.palletPanel',
  'frontendApp.directives.dslPanel'
])
  .config(function ($routeProvider, $httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    // Maps local URLs to a given controller
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

angular.module('frontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  'frontendApp.services.attributesContext', // Services
  'frontendApp.services.modelUpdater',
  'frontendApp.services.raptideAPIHTTP',
  'frontendApp.services.paletteSelection',

  'frontendApp.directives.attributesPanel', // Directives
  'frontendApp.directives.w2uiLayout',
  'frontendApp.directives.editorGraphPanel',
  'frontendApp.directives.palettePanel',
  'frontendApp.directives.dslPanel'
])
  .config(function ($routeProvider, $httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

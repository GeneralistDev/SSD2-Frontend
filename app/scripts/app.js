'use strict';

angular.module('frontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'frontendApp.services.dummy',
  'frontendApp.services.attributesContext',
  'frontendApp.services.raptideAPIHTTP',
  'frontendApp.directives.attributesPanel',
  'frontendApp.directives.w2uiLayout',
  'frontendApp.directives.editorGraphPanel',
  'frontendApp.directives.paletPanel',
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
      .when('/ui', {
        templateUrl: 'views/ui.html',
        controller: 'UiCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';
 
 // The DSL-Panel Directive handles the presentation of the DSL data retrieved from the RAPTIDE API.
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		template : '<h3>{{data}}</h3>', //TODO: use an external html file template
		controller : controller,
	}

	// Manages the interactions between the raptideAPIHTTP service.
	// This essentially requests the DSL from the service and formats it in a presentable way.
	//
	// TODO: Syntax highlighting and proper code formatting. 
	function controller($scope, $element, $timeout) {
		$scope.data = "this is the dsl panel";

    	// TODO: make GET/DSL request on the event of a successful {PUT or POST}/vismodel request
	}
  });
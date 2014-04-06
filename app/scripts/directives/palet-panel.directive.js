'use strict';
 
var app = angular.module('frontendApp.directives.paletPanel', [])
  .directive('paletPanel', function($compile) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		template : '<h3>this is the palet panel</h3>',
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {

    	console.log("hello palet controller");
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
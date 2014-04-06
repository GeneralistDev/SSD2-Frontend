'use strict';
 
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		template : '<h3>this is the dsl panel</h3>',
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {

    	console.log("hello dsl controller");
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
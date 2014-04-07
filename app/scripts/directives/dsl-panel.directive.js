'use strict';
 
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile, dummy) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		template : '<h3>{{data}}</h3>',
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {
		$scope.data = "this is the dsl panel";
    	console.log("hello dsl controller");

    	$scope.$on(dummy.attributesNameUpdateEvent(), function(event) {
    		$scope.data = dummy.attributes.name;
    	})
    	// $scope.$on('fred', function(event, data) {
    	// 	// console.log(data);
    	// 	$scope.data = data;
    	// });
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
'use strict';
 
var app = angular.module('frontendApp.directives.attributesPanel', [])
  .directive('attributesPanel', function($compile) {
	return {
		restrict : 'A',
		// replace: true,
		scope : {},
		templateUrl : 'views/attributes-panel.html',
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {
	    $scope.attributes = {
      		name: "..."
    	};

	    $scope.attributesChangeHandler = function() {
	      console.log("attributesChangeHandler");
	      // editorOb.refresh();
	      //TODO: update editor view
	    };

    	console.log("hello attributes controller");
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
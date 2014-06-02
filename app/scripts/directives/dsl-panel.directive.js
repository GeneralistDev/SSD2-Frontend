'use strict';
 
 // The DSL-Panel Directive handles the presentation of the DSL data retrieved from the RAPTIDE API.
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile, $window, raptideAPIHTTP ) {
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

		$scope.data = "...";
		var _self = this;
    	$scope.$on(raptideAPIHTTP.putVisualModelOKEvent(), function(event) {
    		//request dsl update from server
    		try {
	    		raptideAPIHTTP.getDSL(function(data) { // On success
	    			$timeout(function() {
	    				if(data === "" ) {
	    					data = "... (server responded with nothing)";
	    				}

	    				$scope.data = data;
	    				console.log("Data:" + data);
	    				// $scope.apply();
	    				//Notify the visualModelValidStateService that the visual model is valid
	    			});
	    		},
	    		function(data, status) { // On error

	    			//TODO: interpret error code and use as part of the error message?
	    			$scope.data = data;
	    			_self.$window.alert("Invalid Visual Model:" + data );

	    		});
    		} catch(e) {
    			if (e instanceof VisualModelIDException) {
			        console.log(e.message);
			    } else {
			        console.log("Unknown exception was handled");
			    }
			    // TODO: handle exception here
    		}
    	});
	}
  });
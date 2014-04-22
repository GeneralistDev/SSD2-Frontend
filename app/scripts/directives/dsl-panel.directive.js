'use strict';
 
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile, raptideAPIHTTP) {
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
	    			});
	    		},
	    		function(data, status) { // On error

	    		});
    		} catch(e) {
    			if (e instanceof VisualModelIDException) {
			        console.log(e.message);
			    } else {
			        console.log("Unknown exception was handled");
			    }
			    // console.log("Got here");
			    //TODO: handle exception here
    		}
    	});
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
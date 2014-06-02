'use strict';
 
 // The DSL-Panel Directive handles the presentation of the DSL data retrieved from the RAPTIDE API.
var app = angular.module('frontendApp.directives.dslPanel', [])
  .directive('dslPanel', function($compile, $window, raptideAPIHTTP ) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		templateUrl : 'views/dsl-panel.html', //TODO: use an external html file template
		controller : controller,
	}

	// Manages the interactions between the raptideAPIHTTP service.
	// This essentially requests the DSL from the service and formats it in a presentable way.
	//
	// TODO: Syntax highlighting and proper code formatting. 
	function controller($scope, $element, $timeout) {

		$scope.dsl = "...";
		$scope.showErrorMsg = false;
		$scope.errorMsg = "Empty Visual Model";

		var _self = this;

		$scope.$on(raptideAPIHTTP.postVisualModelErrorEvent(), function(event) {
			$scope.showErrorMsg = true;
			$scope.errorMsg = getErrorMsg(raptideAPIHTTP.postVisualModelResponseCode);
		
		});

		$scope.$on(raptideAPIHTTP.putVisualModelErrorEvent(), function(event) {
			$scope.showErrorMsg = true;
			$scope.errorMsg = getErrorMsg(raptideAPIHTTP.postVisualModelResponseCode);
		});

		$scope.$on(raptideAPIHTTP.postVisualModelOKEvent(), function(event) {
			$scope.showErrorMsg = false;
			$scope.errorMsg = "";
		});

    	$scope.$on(raptideAPIHTTP.putVisualModelOKEvent(), function(event) {
    		//request dsl update from server

			$scope.showErrorMsg = false;
			$scope.errorMsg = "";

    		try {
	    		raptideAPIHTTP.getDSL(function(data) { // On success
	    			$timeout(function() {
	    				if(data === "" ) {
	    					data = "..."; //TODO: remove this
	    				}
	    				console.log("Data:" + data);

	    				$scope.dsl = data;
	    				
	    				$scope.showErrorMsg = false;
	    			});
	    		},
	    		function(data, status) { // On error

	    			//TODO: interpret error code and use as part of the error message?
	    			$scope.dsl = "...";
	    			$scope.showErrorMsg = true;
	    			$scope.errorMsg = "Invalid Visual Model:" + data; 

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
		
		// Returns an appropriate error message string, based on the given response code.
		function getErrorMsg(responseCode) {
			switch( responseCode )
			{
				case 400: //Bad Request
					return "The visual model violates the validation contraints";

				case 401: //Unauthorized
					return "Failed to authenticate this session";

				case 403: //Forbidden
					return "Failed to authenticate this session";

				case 404: //Not found
					return "Server has been restarted, please refresh the page (sorry)";

				case 406: //Not Acceptable
					return "Invalid visual model JSON";

				case 410: //Gone
					return "Your session has timed out, refresh the page (sorry)";

				case 500: //Internal Server Error
					return "Server has encountered a seriouse problem";

				case 503: //Service Unavailable
					return "Server is offline or too busy to process the visual model";

				case 510: //Not implemented
					return "Server requires features that have not been implemented in "+
										"order to process the visual model";

				default: 
					return "Trying to connect";
			}
		}
	}
  });
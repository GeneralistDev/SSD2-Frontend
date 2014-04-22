'use strict';
 
var app = angular.module('frontendApp.directives.attributesPanel', [])
  .directive('attributesPanel', function($compile, $rootScope, attributesContext) {
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
	    
	    // Attribute values that are bound to the attributes form
	    $scope.enitityType = "...";

    	// Entity that is currently selected
    	$scope.context= {
	  		entity : {
	  			attributes : {
      				name: "..."
    			}},
	  		entityIsNode : true
  		};

  		var contextWasJustChanged = false; 

    	// Handles context changed event (new selection is made in graph).
    	// Updates local context.
		$scope.$on(attributesContext.contextChangedEvent(), function(event) {
			$timeout(function() {
					    	
				$scope.context = attributesContext.context;
			    console.log($scope.context);
			    // Supresses the initial attributes change event that occurs when the context changes
			    contextWasJustChanged = true;

			    console.log($scope.context.entityIsNode);

			    if($scope.context.entityIsNode === true) {
			    	$scope.enitityType = "Node";
			    	console.log("Got here!");
			    }
			    else {
			    	$scope.enitityType = "Link";
			    }
			}); 
	    });

		// Sends updates to the editor graph. 
	    $scope.attributesChangeHandler = function() {
	    	if(contextWasJustChanged === true) {
	    		contextWasJustChanged = false; 
	    		return;
	    	}

      		console.log("attributesChangeHandler from attributes panel");

      		// $scope.context.entity.attributes = $scope.attributes;
      		attributesContext.updateAttributes($scope.context.entity, $scope.context.entityIsNode );

      		$scope.context = attributesContext.context; 
	    };
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
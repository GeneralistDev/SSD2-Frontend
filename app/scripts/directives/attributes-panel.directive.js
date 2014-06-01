'use strict';
 
 // The attributes panel directive allows the user to modify and and attributes to the current
 // graph selection (selected entity). It's first responsibility is to change the 
 // the current form context (defines which entities attributes will be displayed) when
 // the user selects a new entity on the graph.
 // It's second responsability is to update the visual model and notify the editor graph 
 // directive when the user makes any changed to the attributes. 
var app = angular.module('frontendApp.directives.attributesPanel', [])
  .directive('attributesPanel', function($compile, $rootScope, attributesContext) {
	return {
		restrict : 'A',
	     // replace: true,
		scope : {},
		templateUrl : 'views/attributes-panel.html',
		controller : controller
	}

	// Handles the main business logic for the attributes panel directive
	function controller($scope, $element, $timeout) {
	    
	    // Attribute values that are bound to the attributes form
	    $scope.enitityType = "...";

    	// Entity that is currently selected
    	$scope.context= {
	  		entity : {
	  			linkType : "screenTransitionLink",
	  			attributes : {
      				name: "...",
      				layoutItems : [{value: "hello",
      								viewType: "Web"}]
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

	    // Used in the screen node context to add layout items
	    $scope.addLayoutItem = function() {
			$timeout(function() {
				// $scope.context.entity.attributes.layoutItems.push({})
				$scope.context.entity.attributes.layoutItems.push({viewType : "", value : ""});
			});	
		};

		// Used in the screen node context to remove layout items
		$scope.removeLayoutItem = function() {
			$timeout(function() {
				// $scope.context.entity.attributes.layoutItems.push({})
				$scope.context.entity.attributes.layoutItems.splice(-1,1);
			});	
		}
	}
  });
'use strict';
 
var app = angular.module('frontendApp.directives.attributesPanel', [])
  .directive('attributesPanel', function($compile, $rootScope, dummy, attributesContext) {
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
	    // $scope.attributes = {
     //  		name: "..."
    	// };


    	// Entity that is currently selected
    	$scope.context= {
	  		entity : {
	  			attributes : {
      				name: "..."
    			}},
	  		entityIsNode : true
  		};

    	
    	// Handles context changed event (new selection is made in graph).
    	// Updates local context.
		$scope.$on(attributesContext.contextChangedEvent(), function(event) {

		    $scope.context = attributesContext.context;

		    $timeout(function() {
				$scope.apply();
			});
	    });

	    // $rootScope.apply();

	    $scope.attributesChangeHandler = function() {
      		console.log("attributesChangeHandler from attributes panel");
      		// $rootScope.$broadcast('fred', $scope.attributes.name);

      		dummy.setName($scope.context.entity.attributes.name);

      		// $scope.context.entity.attributes = $scope.attributes;
      		attributesContext.updateAttributes($scope.context.entity, $scope.context.entity.entityIsNode );

      		$scope.context = attributesContext.context; 
	    };

    	console.log("hello attributes controller");
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });
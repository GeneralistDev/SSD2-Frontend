'use strict';
 
 // The attributes panel directive allows the user to modify and and attributes to the current
 // graph selection (selected entity). It's first responsibility is to change the 
 // the current form context (defines which entities attributes will be displayed) when
 // the user selects a new entity on the graph.
 // It's second responsability is to update the visual model and notify the editor graph 
 // directive when the user makes any changed to the attributes. 
var app = angular.module('frontendApp.directives.attributesPanel', [])
  .directive('attributesPanel', function($compile, $rootScope) {
	return {
		restrict : 'A',
	     // replace: true,
		scope : {},
		templateUrl : 'views/attributes-panel.html',
		controller : controller
	}

	// Handles the main business logic for the attributes panel directive
	function controller($scope, $element, $timeout) {
	    
    	// TODO: Handle the context changed event (when a new selection is made in graph).
    	// TODO: Update the local form context.

		// TODO: Sends attributes update to the editor graph so that the visual model can be updated
	}
  });
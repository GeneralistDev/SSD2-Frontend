'use strict';
 
 // The Pallet panel directive allows the user to add new entities (links and nodes) to the graph.
 // The current implementation focuses on letting the user make a selection from the pallet. 
 // This selection defines what type of entity will be added when the user makes a subsequent 
 // interaction that would result in the adding of an entity.
 // 
 // Future implimentations may utilise the drag and drop approach which is considered to be more
 // user friendly.
 // 
 // The main responsabilities include the presentation of the available entities that can be added
 // to the graph and notifying the editor graph of the entity adding mode that has been selected.
var app = angular.module('frontendApp.directives.palletPanel', [])
  .directive('palletPanel', function($compile) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		template : '<h3>this is the palet panel</h3>',
		controller : controller
	}

	// Handles the business logic of the pallet panel directive.
	function controller($scope, $element, $timeout) {
		// TODO: Load the available entities from a config
		// TODO: Show the available entities in a selecter
		// TOOD: Notify the editor graph when a pallet selection occurs.
	}
  });
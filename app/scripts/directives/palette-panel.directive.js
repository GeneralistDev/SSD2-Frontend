'use strict';
 
 // The palette panel directive allows the user to add new entities (links and nodes) to the graph.
 // The current implementation focuses on letting the user make a selection from the palette. 
 // This selection defines what type of entity will be added when the user makes a subsequent 
 // interaction that would result in the adding of an entity.
 // 
 // Future implimentations may utilise the drag and drop approach which is considered to be more
 // user friendly.
 // 
 // The main responsabilities include the presentation of the available entities that can be added
 // to the graph and notifying the editor graph of the entity adding mode that has been selected.
var app = angular.module('frontendApp.directives.palettePanel', [])
  .directive('palettePanel', function($compile, $window) {
	return {
		restrict : 'A',
		replace: true,
		scope : {},
		templateUrl : 'views/palette-panel.html',
		controller : controller
	}

	// Handles the business logic of the palette panel directive.
	function controller($scope, $element, $timeout) {
		
		$scope.selectPaletteOption = function(value) {
			// $window.alert(value.label);
			$scope.currentSelection = value;
		}

		// TODO: Show the available entities in a selecter
		// TOOD: Notify the editor graph when a palette selection occurs.
		$scope.linkOptions = loadLinkOptions();
		$scope.nodeOptions = loadNodeOptions();

		$scope.currentSelection = $scope.linkOptions[0];
	}

	// Loads the list of available link options
	function loadLinkOptions() {

		// TODO: Load the available link options from a config
		var linkOptions = [{
								linkIndex : 0,
								linkType : "screenTransitionLink",
								label : "Screen Transition Link",
								icon : "images/ScreenTransitionLinkIcon.svg",
							}];

		return linkOptions;
	}

	// Loads the list of available node options
	function loadNodeOptions() {

		// TODO: Load the available link options from a config
		var nodeOptions = [{
							listIndex : 0,
							nodeType : "appProperties",
							label : "App Properties",
							icon : "images/AppPropertiesIcon.svg",
						},
						{
							listIndex : 1,
							nodeType : "screenNode",
							label : "Screen Node",
							icon : "images/DefaultScreenIcon.svg",
						}];

		return nodeOptions;
	}
  });
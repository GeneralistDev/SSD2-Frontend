'use strict';


// This is an event object which maintains the palette option selection context (i.e., what
// palette is currently selected). 
// When the context changes an event is fired. 
// Singleton
var app = angular.module('frontendApp.services.paletteSelection', [])
  .service('paletteSelection', function($rootScope) {
  	
    //Option that has been selected
  	this.selectedOption= { 
  		optionType : "screenNode", // Default
  		optionIsNode : true
  	};

  	// Returns the unique event identifier of of the selectionMadeEvent
  	// This event type is issued when a user selects an option from the palette.
  	this.selectionMadeEvent = function() {
		  return "paletteSelection.selectionMadeEvent";
	  }

  	// Updates the selection state this will result in the selectionMadeEvent 
    // being fired.
  	this.makeSelection = function(optionType, isNode) {
      console.log("Selected Palette Option:");
      console.log(optionType);
  		this.selectedOption.optionType = optionType;
  		this.selectedOption.optionIsNode = isNode;

  		$rootScope.$broadcast(this.selectionMadeEvent());
	  }
});
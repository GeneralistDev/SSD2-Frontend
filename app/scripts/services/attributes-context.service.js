'use strict';


// This is an event object that contains the application context data.
// When the context changes an event is fired. 
//Singleton
var app = angular.module('frontendApp.services.attributesContext', [])
  .service('attributesContext', function($rootScope) {
  	
    //Selected context
  	this.context= {
  		entity : {},
  		entityIsNode : true
  	};

  	// Returns the unique event identifier of of the contextChangedEvent
  	// This event type is issued when the context has changed
  	this.contextChangedEvent = function() {
		  return "attributesContext.contextChangedEvent";
	  }

    // Returns the unique event identifier of the updateElementEvent. 
    // This event type is issued when the selectected element attributes are updated 
    // from the attributes panel. 
    this.updateAttributesEvent = function() {
      return "attributesContext.updateAttributesEvent";
    }

  	// Changes the attributes context. 
  	this.changeContext = function(selectedEntity, isNode) {
      console.log("CHanged context:");
      console.log(JSON.stringify(selectedEntity.attributes));
  		this.context.entity = selectedEntity;
  		this.context.entity.entityIsNode = isNode;



  		$rootScope.$broadcast(this.contextChangedEvent());
	  }

    //called by the attributes panel
    this.updateAttributes = function( updatedEntity, isNode) {
      if((isNode === this.context.entityIsNode ) && (updatedEntity.id === this.context.entity.id) ) {
        this.context.entity = updatedEntity;
        $rootScope.$broadcast(this.updateAttributesEvent());
      } else {
        //Throw desynchronisation error!
        console.log("entity desynchronisation error!");
      }
    }
});
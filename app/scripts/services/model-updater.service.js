'use strict';

// Handles the update request timing logic. NOTE: this assumes that the visual model is valid.
// Singleton
var app = angular.module('frontendApp.services.modelUpdater', [])
	.service('modelUpdater', function(raptideAPIHTTP, $timeout) {
		var _self = this;
		this.visualModel = {}; // Assumes that the visualModel is valid

		var updateRequired = false; // TRUE: update request will be sent at next cycle.
		var delayRequired = false; // TRUE: update will be delayed until the following cycle.
		var delayTime = 1000;

		// Performs a putVisModel request to the raptide api if an update is required.
		// If a delay is required it will instead schedule another periodical update.
		this.periodicalUpdate = function(delay){
		    $timeout(function() {

			    if( delay >= (delayTime * 20)) {
			    	delay = delayTime;
			    	console.log("PeriodicalUpdate delay cap reached");
			    } else {
			    	delay = delay + delay / 2;
			    }

		    	if(delayRequired === true) {
		    		delayRequired = false;
		    		console.log("Update delayed for " + delay + " ms");
		    		_self.periodicalUpdate(delay);
		    	} else {
		    		updateRequired = false;

		    		try {
		    			if(raptideAPIHTTP.vismodelid === "") { 

		    				raptideAPIHTTP.postVisualModel(_self.visualModel, function(data) { // On Success
			    			//TODO: handle success callback.
			    			}, 
			    			function(data, status) { // On Error
			    				console.log("Next update attempt scheduled in " + delay + " ms");
					    		_self.periodicalUpdate(delay);
			    			});
		    			} else {
				    		
				    		raptideAPIHTTP.putVisualModel(_self.visualModel, function(data) { // On Success
				    			//TODO: handle success callback.
				    		}, 
				    		function(data, status) { // On Error
			    				console.log("Next update attempt scheduled in " + delay + " ms");
					    		_self.periodicalUpdate(delay );
			    			});
			    		}
		    		} catch(e) {
		    			if (e instanceof VisualModelIDException) {
					        console.log("VisualModelIDException: " + e.message);
					    } else {
					        console.log("Unknown exception was handled");
					    }

					    console.log("Next update attempt scheduled in " + delay + delay / 2 + " ms");
					    _self.periodicalUpdate(delay + delay / 2);
    				}
		    	}
	    	}, delay); //TODO: increase delay based on update frequency
	  	};

	  	// Updates the visual model and schedules a periodical update. 
	  	// This assumes that the model is valid.
		this.updateVisualModel = function(model) {
			this.visualModel = model; 
			console.log("updateVisualModel got here");
			if(updateRequired === true ) {
				delayRequired = true;
				// console.log("Delaying update request for " + delayTime + " ms");
			} else {
				updateRequired = true;
				console.log("Update request scheduled in " + delayTime + " ms");
				this.periodicalUpdate(delayTime);
			}
		}
	});
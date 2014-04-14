'use strict';

//A dummy service used to create and identify dummy events
//See http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/

//Singleton
var app = angular.module('frontendApp.services.dummyHTTP', [])
  .service('dummyHTTP', function($http) {
  	
  	this.attributes= {
		name : '...'
  	};

  	this.getDummy = function(callback) {
  		//authentication code here
		$http.get("/url").success(function(data){
			callback(data);
		});
	}

  	//use to fire the event
  	this.setName = function(name) {
		this.attributes.name = name;
		$rootScope.$broadcast("dummy.attributes.name.update");
	}
  });
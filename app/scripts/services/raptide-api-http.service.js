'use strict';

//A dummy service used to create and identify dummy events
//See http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/

//Singleton
var app = angular.module('frontendApp.services.raptideAPIHTTP', [])
  .service('raptideAPIHTTP', function($http) {
  	
  	this.vismodelid = "10"; //TODO: determine this more logically
    this.url = "http://localhost:9000";

    // dsl directive calls this on PutModelOk event
    this.getDSL = function(callback) {

      //TODO: proper logging.
      console.log("Making get DSL request");
      var putdata = "{}";
      $http({ method: "GET",
              url: (this.url + "/apk/" + this.vismodelid),
              data: putdata,
              // withCredentials: true,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
      }).success(function(data, status, headers, config){
              callback(data);
              console.log("Twas a success miladdy");
              //Fire getDSL ok event
      }). error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("Thar she blows status:" + status );
              //Fire getDSL fail event
      });
    }

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

    //TODO: fire event for every inbound and out bend http request event.
});
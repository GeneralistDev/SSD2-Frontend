'use strict';

// Singleton
// Acts as the interface to the raptide API web server. When a successful respones is recieved 
// a global event is fired pertaining to the response type, informing the controllers and allowing
// them to respond appropriately. 
// 
// Refer to the API docs for more information on response codes and valid request.
// See Link:
// https://docs.google.com/document/d/1ymm5JxymRaUHveXnVgvbNbWf8D08Hx2GNmioxPNem50/edit
var app = angular.module('frontendApp.services.raptideAPIHTTP', [])
  .service('raptideAPIHTTP', function($http, $rootScope) {
  	
    var _self = this;
  	this.vismodelid = ""; //TODO: determine this more logically
    this.url = "http://localhost:9000";

    //NOTE: events are issued after the callbacks of a successful request have been executed.

    // Returns the unique event identifier of of the getDSLOKEvent
    // This event type is issued after an ok response is recieved after a getDSL request.
    this.getDSLOKEvent = function() {
      return "attributesContext.getDSLOKEvent";
    }

    // Returns the unique event identifier of the updateVisualModelOKEvent. 
    // This event type is issued after an ok response is recieved after a updateVisualModel request.
    this.putVisualModelOKEvent = function() {
      return "attributesContext.putVisualModelOKEvent";
    }

    // Returns the unique event identifier of the postVisualModelOKEvent. 
    // This event type is issued after an ok response is recieved after a postVisualModel request.
    this.postVisualModelOKEvent = function() {
      return "attributesContext.postVisualModelOKEvent";
    }

    // Returns the link to directly download the APK file from the server.
    this.getAPKURL = function()
    {
        if(this.vismodelid === "") {
	        console.log("APK download link could not be created. visual model id has been provided");
	        throw new VisualModelIDException("No visual model id has been set"); 
      	}

    	return this.url + "/apk/" + this.vismodelid;
    }

    // DSL directive calls this on PutModelOk event.
    // Retrieves the DSL for the given vismodelid from the raptide- API.  
    // This should be called after a successful postVisualModel call. 
    this.getDSL = function(successCallback, errorCallBack) {

      if(this.vismodelid === "") {
        console.log("GET DSL request could not be sent: visual model id has been provided");
        throw new VisualModelIDException("No visual model id has been set"); 
      }

      //TODO: proper logging.
      console.log("Making GET DSL request");

      $http({ method: "GET",
              url: (this.url + "/dsl/" + this.vismodelid),
              // withCredentials: true,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
      }).success(function(data, status, headers, config){
              
              console.log("GET DSL request was successful");
              successCallback(data);
              $rootScope.$broadcast(_self.getDSLOKEvent()); 
              //Fire getDSL ok event
      }). error(function(data, status, headers, config) {

              // TODO: case the status and provide a suitable error message based on the response code
              console.log("GET DSL request was unsuccessful. Error code: " + parseInt(status));

              errorCallBack(data, status);
      });
    }

    // Updates the visual model that which is defined in the param visModel.
    // This should be called after a successful postVisualModel call. 
    this.putVisualModel = function(visModel, successCallback, errorCallBack) {
      
      if(this.vismodelid === "") {
        console.log("PUT vismodel request could not be sent: No visual model id has been provided");
        throw new VisualModelIDException("No visual model id has been set"); 
      }

      console.log("Making PUT vismodel request");
      
      // var putdata = "{}"; //TODO: use visModel param
      var putdata = visModel;

      $http({ method: "PUT",
              url: (this.url + "/vismodel/" + this.vismodelid),
              data: putdata,
              // withCredentials: true,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
      }).success(function(data, status, headers, config){
              
              console.log("PUT vismodel request was successful");
              successCallback(data);
              $rootScope.$broadcast(_self.putVisualModelOKEvent()); 
         
      }). error(function(data, status, headers, config) {

              console.log("PUT vismodel request was unsuccessful. Error code: " + parseInt(status));
              // Inform the presentation that an error indication should be displayed.
              errorCallBack(data, status);
      });
    }

    // Posts (creates) the visual model (visModel) on the server and stores the session id. 
    // If a post has already been made the old session id will be overwritten. 
    this.postVisualModel = function(visModel, successCallback, errorCallBack) {
      console.log("Making POST vismodel request");
      // this.putVisualModel(visModel, successCallback, errorCallBack);
      // var putdata = "{}"; //TODO: use visModel param
      var putdata = visModel;

      $http({ method: "POST",
              url: (this.url + "/vismodel"),
              data: putdata,
              // withCredentials: true,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
      }).success(function(data, status, headers, config){
              _self.vismodelid = data.id;
              
              console.log("POST vismodel request was successful. Key retreved was " + _self.vismodelid);
              successCallback(data);
              $rootScope.$broadcast(_self.postVisualModelOKEvent()); 

      }). error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("POST vismodel request was unsuccessful. Error code: " + parseInt(status));
              //Fire getDSL fail event
              errorCallBack(data, status);
              // throw "exception";
      });
    }
});


function VisualModelIDException(message) {
  this.message = message;
  this.name = "NoVisualModelIDException";
}

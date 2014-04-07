'use strict';

var app = angular.module('frontendApp.services.dummy', [])
  .service('dummy', function($rootScope) {
  	var service = {
  		
  		attributes : {
  			name : '...'
  		},

  		attributesNameUpdateEvent : function() {
  			return "dummy.attributes.name.update";
  			//To listen to this event use $scope.$on(dummy.attributesNameUpdateEvent(),
  				// function(event) {...});
  		},

  		setName : function(name) {
  			service.attributes.name = name;
  			$rootScope.$broadcast("dummy.attributes.name.update");
  		}
  	}

  	return service;
  });
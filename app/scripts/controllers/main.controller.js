'use strict';

// This is the main controller for the RAPTIDE app. It's mainly responsible for managing
// the download button as the rest of the core business logic is handled in other directives
// and services.
angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope, $compile, $timeout, $document, raptideAPIHTTP ) {


  	// Sets the download APK link
	$scope.$on(raptideAPIHTTP.postVisualModelOKEvent(), function(event) {

		//TODO: set download link to grey by default
		//TODO: set download link to available after the first successful post request (or after SNMP trap)
		$scope.url = raptideAPIHTTP.getAPKURL();
	});

	//TODO: session validation
});


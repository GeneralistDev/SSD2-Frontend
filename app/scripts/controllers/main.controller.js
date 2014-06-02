'use strict';

// This is the main controller for the RAPTIDE app. It's mainly responsible for managing
// the download button as the rest of the core business logic is handled in other directives
// and services.
angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope, $compile, $timeout, $document, raptideAPIHTTP ) {

  	$scope.validVismodel = false; // Download button is greyed out by default

  	// Sets the download APK link
	$scope.$on(raptideAPIHTTP.postVisualModelOKEvent(), function(event) {

		$scope.url = raptideAPIHTTP.getAPKURL();
	});

	$scope.$on(raptideAPIHTTP.getDSLErrorEvent(), function(event) {

		$scope.validVismodel = false; //Greys out the download button
	});

	$scope.$on(raptideAPIHTTP.getDSLOKEvent(), function(event) {

		$scope.validVismodel = true; //Ungreys the download button (so the user can download the APK)
	});

	//TODO: session validation
});


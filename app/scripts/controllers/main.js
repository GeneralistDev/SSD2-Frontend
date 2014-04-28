'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope, $compile, $timeout, $document, raptideAPIHTTP ) {


  	// Sets the download APK link
	$scope.$on(raptideAPIHTTP.postVisualModelOKEvent(), function(event) {

		//TODO: set download link to grey by default
		//TODO: set download link to available after the first successful post request (or after SNMP trap)
		$scope.url = raptideAPIHTTP.getAPKURL();
	});
});


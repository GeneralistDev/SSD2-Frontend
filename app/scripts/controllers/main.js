'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope, $compile, $timeout, $document, raptideAPIHTTP ) {

    $scope.submit = function() {
        $window.alert("submitted!");
        raptideAPIHTTP.getAPK( function(data) { // On Success
        //TODO: handle success callback.
        }, 
        function(data, status) { // On Error
        });
    }
});


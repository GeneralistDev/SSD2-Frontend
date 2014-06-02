'use strict';

// The W2UI layout directive has two main responsabilities:
// 			-To create a W2UI panel layout which contain the html and directive tags for each of the panel
// 			directives.
// 			-To compile the angular directives within the html content of each of the panels.
// In addition to this, it also styles the w2ui panel layout.
var app = angular.module('frontendApp.directives.w2uiLayout', [])
  .directive('w2uiLayout', function($compile) {
	return {
		restrict : 'A',
		scope : {},
		compile : compile
	}

	function controller($scope, $element, $timeout) {
    	// $timeout(function() {
    	// 	//recompiles all of the panel directives 
    	// 	$compile($element.contents())($scope);
     //    	$scope.$apply();
    	// });
	}

	function link(scope, element, attrs){
        
	}

	// Handles the compile logic for the w2UI-layout dirctive 
	//TODO: use transcludes to assign the elements
	function compile(tElement, tAttrs, transclude) {
		// Define the W2UI layout panel style
		var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	    
	    // Creates the W2UI layout with the appropriate panels
	    $(tElement).w2layout({
	      	name: 'layout',
	      	panels: [
	          { type: 'left',  size: 200, resizable: true, style: pstyle, content: 'palette' },
	          { type: 'main', size: 600, resizable: true, style: pstyle },
	          { type: 'bottom',  size: 200, resizable: true, style: pstyle, content: 'DSL' },
	          { type: 'right',  size: 200, resizable: true, style: pstyle, content: 'preview' }
	        ]
	    }); // End layout

	    // Maps the panel content to each of the appropriate panel directives
	    w2ui['layout'].content('right', '<div attributes-panel></div>');
	    w2ui['layout'].content('main', '<div editor-graph-panel></div>');
	    w2ui['layout'].content('left', '<div palette-panel></div>');
	    w2ui['layout'].content('bottom', '<div dsl-panel></div>');

	    // After this code is executed the angular directives contained in each of the panels is compiled 
	}
  });
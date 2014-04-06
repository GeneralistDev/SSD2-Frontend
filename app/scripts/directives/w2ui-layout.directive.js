'use strict';

var app = angular.module('frontendApp.directives.w2uiLayout', [])
  .directive('w2uiLayout', function($compile) {
	return {
		restrict : 'A',
		scope : {},
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {
    	$timeout(function() {
    		//recompiles all of the panel directives 
    		$compile($element.contents())($scope);
        	$scope.$apply();
    	});
	}

	function link(scope, element, attrs){
        
	}

	//TODO: use transcludes to assign the elements
	function compile(tElement, tAttrs, transclude) {
		var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	    
	    $(tElement).w2layout({
	      	name: 'layout',
	      	panels: [
	          { type: 'left',  size: 200, resizable: true, style: pstyle, content: 'palette' },
	          { type: 'main', size: 600, resizable: true, style: pstyle },
	          { type: 'bottom',  size: 200, resizable: true, style: pstyle, content: 'DSL' },
	          { type: 'right',  size: 200, resizable: true, style: pstyle, content: 'preview' }
	        ]
	    }); // End layout

	    w2ui['layout'].content('right', '<div attributes-panel></div>');
	    w2ui['layout'].content('main', '<div editor-graph-panel></div>');
	    w2ui['layout'].content('left', '<div palet-panel></div>');
	    w2ui['layout'].content('bottom', '<div dsl-panel></div>');
	}
  });
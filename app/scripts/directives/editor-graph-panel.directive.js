'use strict';
 
//requires my-graph.util.js import
//requires editor.util.js import

var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile) {
  	var elem;
	return {
		restrict : 'A',
		scope : {},
		compile : compile,
		controller : controller,
		link : link, 
	}

	function controller($scope, $element, $timeout) {
    	console.log("hello editor controller");
		
		$scope.$on('$routeChangeSuccess', function() {
    		//TODO: fix so that this is not hard coded
    		var editorGraph = new myGraph("#layout_layout_panel_main > div.w2ui-panel-content", 1500, 1500);
			var editorOb = new editor(editorGraph);
    		var node1 = editorGraph.addNode("Cause", 50, 40);
  			var node2 = editorGraph.addNode("Effect", 70, 60);
    	});
    	
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });


function editor(graph) {  
  // var scope = angular.element('#root').scope();  
  var selectedEntity;
  var nodeIsSelected = false; // false: linkIsSelected, true: node is selected

  var node1 = graph.addNode("Cause", 50, 40);
  var node2 = graph.addNode("Effect", 70, 60);

  graph.addLink(node1, node2, "fred");
  // graph.selection.addNodeMode = true;

  graph.dispatch = d3.dispatch("canvasMouseDown", "nodeMouseDown", "linkMouseDown");
  
  graph.dispatch.on("canvasMouseDown", function(point){
  
    selectedEntity = graph.addNode("", point[0], point[1] );
    nodeIsSelected = true;
  })
  .on("nodeMouseDown", function(node){
    console.log("node clicked:" + node.id);
    nodeIsSelected = true;
    selectedEntity = node;

    // scope.attributes.name = selectedEntity.name;
    // scope.apply();
  })
  .on("linkMouseDown", function(link){
    console.log("link clicked"+ link.id);
    nodeIsSelected = false;
    selectedEntity = link;

    // scope.attributes.name = selectedEntity.name;
    // scope.apply();
  })
  
  // this.refresh = function(attributes) {
  //   console.log("changing");

  //   if( nodeIsSelected )
  //   {
  //   	graph.removeNode(selectedEntity.id);
  //   	graph.addNode(scope.attributes.name, selectedEntity.x, selectedEntity.y, selectedEntity.id );
  //   }
  //   else
  //   {
  //     graph.removeLink(selectedEntity.id);
  //     graph.addLink( selectedEntity.source, selectedEntity.target, scope.attributes.name, selectedEntity.id );
  //   }
  // }
}

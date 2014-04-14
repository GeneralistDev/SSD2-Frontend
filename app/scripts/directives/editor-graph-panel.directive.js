'use strict';
 
//requires my-graph.util.js import
//requires editor.util.js import

var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile, modelUpdate) {
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
		
    //

		$scope.$on('$routeChangeSuccess', function() {
    		//TODO: fix so that this is not hard coded
    		//TODO: move the graph initialization to the link
    		var editorGraph = new myGraph("#layout_layout_panel_main > div.w2ui-panel-content", 1500, 1500);
			  var editorOb = new editor(editorGraph);
    	// 	var node1 = editorGraph.addNode("Cause", 50, 40);
  			// var node2 = editorGraph.addNode("Effect", 70, 60);
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
  var previouseSelectedEntity;
  var nodeIsSelected = false; // false: linkIsSelected, true: node is selected
  var nodeIsBeingDragged = false;

  var node1 = graph.addNode( 50, 40, "Cause");
  var node2 = graph.addNode(70, 60, "Effect");

  // graph.addLink(node1, node2, { name: "fred"});
  graph.addLink(node1, node2);
  // graph.selection.addNodeMode = true;

  graph.dispatch = d3.dispatch("canvasMouseDown", "canvasRightClick", 
                    "nodeMouseDown", "nodeMouseUp", "nodeDoubleClick", "linkMouseDown");
  
  graph.dispatch
  .on("canvasMouseDown", function(point) {
    canvasMouseDown(point);
  })
  .on("canvasRightClick", function(point) {
    canvasRightClick(point);
  }) 
  .on("nodeMouseDown", function(node) {
    nodeMouseDown(node);
  }) 
  .on("nodeMouseUp", function(node) {
    nodeMouseUp(node);
  }) 
  .on("nodeDoubleClick", function(node) {
    nodeDoubleClick(node);
  })
  .on("linkMouseDown", function(link) {
    linkMouseDown(link);
  });

  // Handles mouse down on canvas event.
  // Create node on the svg canvas where the user clicked
  var canvasMouseDown = function(point) {
    selectedEntity = graph.addNode(point[0], point[1] );
    nodeIsSelected = true;
  }

  // Handles right click on canvas event.
  // Create a disconnected link where the user clicked.
  var canvasRightClick = function(point) {
    selectedEntity = graph.addDisconnectedLink(point[0], point[1] );
    nodeIsSelected = false;
  }

  // Handles mouse down on node event.
  // Selects node and binds the attributes panel scope to the attributes of 
  // this node.
  var nodeMouseDown = function(node) {
    // console.log("node clicked:" + node.id);

    // if((nodeIsSelected === true) && 
    //   (selectedEntity.nodeType === "disconnected-link-node" ) &&
    //   (selectedEntity !== node)) {

    // }

    if(node !== selectedEntity ) {
      // console.log("previouseSelectedEntity changed from: " + 
      //   previouseSelectedEntity.id + " to : " selectedEntity.id);
      console.log("---");
      previouseSelectedEntity = selectedEntity;

    }
    
    nodeIsSelected = true;
    nodeIsBeingDragged = true;

    selectedEntity = node;

    // console.log("node nodeMouseDown:" +node.id);
    // console.log("selectedEntity nodeMouseDown:" + selectedEntity.id);
    // console.log("previouseSelectedEntity nodeMouseDown :" +previouseSelectedEntity.id);

    // scope.attributes.name = selectedEntity.name;
    // scope.apply();
  }

  // Handles mouse up on node event.
  // Resets node is being dragged state.
  var nodeMouseUp = function(node) {
    // if((nodeIsBeingDragged === true) && 
    //   (selectedEntity.nodeType === "disconnected-link-node" ) &&
    //   (selectedEntity !== node)) {

    //   console.log("join node ep: " + selectedEntity.id);
    //   graph.joinLinkToNode(selectedEntity.link, node, selectedEntity.isTarget );
    // }

    // console.log("node mouse up:" +node.id);
    // console.log("selectedEntity mouse up:" + selectedEntity.id);
    // console.log("previouseSelectedEntity mouse up :" +previouseSelectedEntity.id);

    nodeIsBeingDragged = false;
  }

  var nodeDoubleClick = function(node) {
    // console.log("node double click:" +node.id);
    // console.log("selectedEntity nodeDoubleClick:" + selectedEntity.id);
    // console.log("previouseSelectedEntity double click :" +previouseSelectedEntity.id);
    //is previouse entity different
    //is prev entity discon end point

    if( previouseSelectedEntity !== node && 
      (previouseSelectedEntity.nodeType === "disconnected-link-node" )) {
      
      console.log("join node ep: " + previouseSelectedEntity.id);
      graph.joinLinkToNode(previouseSelectedEntity.link, node, previouseSelectedEntity.isTarget );
    }
  }

  // Handles mouse down on link event. 
  // Selects link and binds the attributes panel scope to the attributes of 
  // this link. 
  var linkMouseDown = function(link) {
    console.log("link clicked"+ link.id);
    nodeIsSelected = false;
    selectedEntity = link;

    // scope.attributes.name = selectedEntity.name;
    // scope.apply();
  }

  
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

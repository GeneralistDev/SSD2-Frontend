'use strict';
 
//requires my-graph.util.js import
//requires editor.util.js import

var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile, attributesContext) {
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
		
    // $scope.$on(attributesContext.updateElement(), function(event) {
    //     //editorGraph.updateElement(attributesContext.element, attributesContext.isNode);
    // });

    var editorGraph, 
        editorOb;

		$scope.$on('$routeChangeSuccess', function() {
    		//TODO: fix so that this is not hard coded
    		//TODO: move the graph initialization to the link
    		editorGraph = new myGraph("#layout_layout_panel_main > div.w2ui-panel-content", 1500, 1500);
			  editorOb = new editor(editorGraph, attributesContext);
    	// 	var node1 = editorGraph.addNode("Cause", 50, 40);
  			// var node2 = editorGraph.addNode("Effect", 70, 60);
    	});

    //Updates the nodes and links on entity update event.
    $scope.$on(attributesContext.updateAttributesEvent(), function(event) {
        if(attributesContext.context.isNode)
          editorGraph.refreshNode(attributesContext.context.entity);
        else {
          editorGraph.refreshLink(attributesContext.context.entity);
        }
    });
	}

	function link(scope, element, attrs) {
	}

	function compile(tElement, tAttrs, transclude) {
	}
  });


function editor(graph, attributesContext) {  
  // var scope = angular.element('#root').scope();  
  // console.log(dummy.setName("fred"));

  graph.dispatch = d3.dispatch("canvasMouseDown", "canvasRightClick", 
                    "nodeMouseDown", "nodeMouseUp", "nodeDoubleClick", "linkMouseDown",
                    "canvasDeleteKeyDown");

  var _self = this;
  var selectedEntity;
  var previouseSelectedEntity;
  var nodeIsSelected = false; // false: linkIsSelected, true: node is selected
  var nodeIsBeingDragged = false;

  
  // graph.selection.addNodeMode = true;

  // graph.dispatch = d3.dispatch("canvasMouseDown", "canvasRightClick", 
  //                   "nodeMouseDown", "nodeMouseUp", "nodeDoubleClick", "linkMouseDown");
  
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
  })
  .on("canvasDeleteKeyDown", function(){
    canvasDeleteKeyDown();
  });

  // Handles mouse down on canvas event.
  // Create node on the svg canvas where the user clicked
  var canvasMouseDown = function(point) {
    selectedEntity = graph.addNode(point[0], point[1] );
    nodeIsSelected = true;

    attributesContext.changeContext(selectedEntity, nodeIsSelected );
  }

  // Handles right click on canvas event.
  // Create a disconnected link where the user clicked.
  var canvasRightClick = function(point) {
    selectedEntity = graph.addDisconnectedLink(point[0], point[1] );
    nodeIsSelected = false;

    attributesContext.changeContext(selectedEntity, nodeIsSelected );
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

    attributesContext.changeContext(selectedEntity, nodeIsSelected );



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

    if( previouseSelectedEntity !== node ) {
        if(previouseSelectedEntity.nodeType === "disconnected-link-node" ) { //error assumes previousely selected entity is a node
        
        console.log("join node ep: " + previouseSelectedEntity.id);
        graph.joinLinkToNode(previouseSelectedEntity.link, node, previouseSelectedEntity.isTarget );
      }
    }
  }

  // Handles mouse down on link event. 
  // Selects link and binds the attributes panel scope to the attributes of 
  // this link. 
  var linkMouseDown = function(link) {
    console.log("link clicked"+ link.id);
    nodeIsSelected = false;
    selectedEntity = link;

    attributesContext.changeContext(selectedEntity, nodeIsSelected );

    // scope.attributes.name = selectedEntity.name;
    // scope.apply();
  }

  var canvasDeleteKeyDown = function() {
    console.log("Key pressed!");

    if((typeof selectedEntity !== "undefined") && 
      (typeof nodeIsSelected !== "undefined") ) {

      if(nodeIsSelected) {
        if( selectedEntity.nodeType !== "disconnected-link-node" ) {
          graph.removeNode(selectedEntity.id);
          console.log("deleting node");
        }
        else {
          console.log("tried to delete disconnected-link-node");
        }
      }
      else {
        graph.removeLink(selectedEntity.id);
        console.log("deleting link");
      }
    }
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

  var demo1 = function() {
    var fredNode = graph.addNode( 50, 40, {name : "Fred"}, "person");
    var barneyNode = graph.addNode(100, 40, {name : "Barney"}, "person");

    var margeNode = graph.addNode( 50, 100, {name : "Marge"}, "person");
    var richardNode = graph.addNode(100, 100, {name : "Richard"}, "person");

    graph.addLink(fredNode, barneyNode, { name: "mates"});
    graph.addLink(margeNode, richardNode, {name: "married"});
  }

  var demo2 = function() {
    var fredNode = graph.addNode( 50, 40, {name : "Fred"}, "person");
    var barneyNode = graph.addNode(100, 40, {name : "Barney"}, "person");

    graph.addLink(fredNode, barneyNode, { name: "mates"});
    graph.addDisconnectedLink(200, 300, {name : "associates"});


    var link = graph.addDisconnectedLink(400, 300, {name : "cohorts"});
    graph.joinLinkToNode(link, barneyNode, false);
  }

  var demo3 = function() {
    var markusNode = graph.addNode( 50, 40, {name : "Markus Lumpe"}, "person");
    var cPlusPLusNode = graph.addNode(100, 40, {name : "C++"}, "person");
    var cSharpDevTeam = graph.addNode(100, 40, {name : "C# dev team"}, "person");

    var danielParkerNode = graph.addNode(100, 40, {name : "Daniel Parker"}, "person");
    var coffeeNode = graph.addNode(100, 40, {name : "Coffee"}, "person");

    graph.addLink(markusNode, cPlusPLusNode, { name: "Best of Friends"});

    graph.addLink(danielParkerNode, coffeeNode, { name: "Loves"});
    graph.addLink(markusNode, cSharpDevTeam, { name: "Enemies"});
    graph.removeNode(danielParkerNode.id);
    var link = graph.addDisconnectedLink(400, 300, {name : "cohorts"});
    graph.joinLinkToNode(link, markusNode, false);
  }

  // demo1();
  // demo2();
 
  demo3();

  var data = graph.getData();

  console.log("data:");
  console.log(JSON.stringify(data));
}

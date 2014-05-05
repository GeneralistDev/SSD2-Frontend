'use strict';

// The Editor graph panel directive is mainly responsible for the presentation and updating of the visual
// model. 
var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile, attributesContext, raptideAPIHTTP, modelUpdater) {
  	var elem;
	return {
		restrict : 'A',
		scope : {},
		controller : controller
	}

  // Handles and delegates the main business logic of the Editor Graph panel
	function controller($scope, $element, $timeout) {
  	console.log("hello editor controller");

    var editorGraph, 
        editorOb;

		$scope.$on('$routeChangeSuccess', function() {
    		//TODO: fix so that this is not hard coded
    		//TODO: move the graph initialization to the link
    		editorGraph = new myGraph("#layout_layout_panel_main > div.w2ui-panel-content", 1500, 1500);
			  editorOb = new editor(editorGraph, attributesContext, modelUpdater);

        $timeout(function() {
          //TODO: Authenticate session
          //Initial call will perform the post visual model request after 1ms
          modelUpdater.updateVisualModel(editorGraph.getData()); //TODO: validate model
        });
    	}, 1000); 

    //Updates the nodes and links on entity update event.
    $scope.$on(attributesContext.updateAttributesEvent(), function(event) {
        if(attributesContext.context.entityIsNode === true) {
          editorGraph.refreshNode(attributesContext.context.entity);
          console.log("node edited");
        } else {
          editorGraph.refreshLink(attributesContext.context.entity);
          console.log("link edited");
        }

        modelUpdater.updateVisualModel(editorGraph.getData()); //TODO: validate model
    });


	}
});


// The editor is responsible for handling the variouse user interaction events dispatched
// by the graph and mapping them to the core business logic. In addition this is also responsible
// for refreshing the visuals of entities when the visualmodel is updated by another module (e.g.,
// the attributes panel).  This is also responsible for managing the visual model and sending 
// model updates to the model updater service.
// 
// Key Interaction Related Responsabilities:
//    -Maping the left click on canvas to: adding nodes
//    -Maping the let click on a node or link to: Selecting a graph entity (notifies the attributes panel
//    to update it's context)
//    -Mapping the right click on one node and the left click on another node to: Adding links between two
//    nodes.
function editor(graph, attributesContext, modelUpdater) {  

  // Defines the events that can be dispatched by the graph
  graph.dispatch = d3.dispatch("canvasMouseDown", "canvasRightClick", 
                    "nodeMouseDown", "nodeMouseUp", "nodeRightClick", "linkMouseDown",
                    "canvasDeleteKeyDown");

  var _self = this;
  var selectedEntity;
  var nodeIsSelected = false; // false: linkIsSelected, true: node is selected
  var nodeIsBeingDragged = false;

  // Binds the events to internal event handler methods 
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
  .on("nodeRightClick", function(node) {
    nodeRightClick(node);
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
    modelUpdater.updateVisualModel(graph.getData()); //TODO: validate model
  }

  // Handles right click on canvas event.
  var canvasRightClick = function(point) {
    // selectedEntity = graph.addDisconnectedLink(point[0], point[1] );
    // nodeIsSelected = true;
    // attributesContext.changeContext(selectedEntity, nodeIsSelected );

  }

  // Handles mouse down on node event.
  // Selects node and binds the attributes panel scope to the attributes of 
  // this node.
  var nodeMouseDown = function(node) {    
    if(node !== selectedEntity) {
      nodeIsSelected = true;
      nodeIsBeingDragged = true;

      selectedEntity = node;

      attributesContext.changeContext(selectedEntity, nodeIsSelected );
    }
  }

  // Handles mouse up on node event.
  // Resets node is being dragged state.
  var nodeMouseUp = function(node) {

    nodeIsBeingDragged = false;
  }

  // Handles node Right Click event.
  // Creates link between previouse node selection (made with left click) and current selection (made with right click)
  var nodeRightClick = function(node) {
    if(nodeIsSelected === true) {
      graph.addLink(selectedEntity, node);
      modelUpdater.updateVisualModel(graph.getData()); //TODO: validate model
    } 

    if(node !== selectedEntity) {
      nodeIsSelected = true;
      selectedEntity = node;

      attributesContext.changeContext(selectedEntity, nodeIsSelected );
    }
  }

  // Handles mouse down on link event. 
  // Selects link and binds the attributes panel scope to the attributes of 
  // this link. 
  var linkMouseDown = function(link) {
    if(link !== selectedEntity) {
      console.log("link clicked"+ link.id);
      nodeIsSelected = false;
      selectedEntity = link;
      console.log("link is selected");
      attributesContext.changeContext(selectedEntity, nodeIsSelected );
    }
  }

  // Handles canvaas delete key event.
  // Deletes selected entity.
  var canvasDeleteKeyDown = function() {
    console.log("Key pressed!");

    if((typeof selectedEntity !== "undefined") && 
      (typeof nodeIsSelected !== "undefined") ) {

      if(nodeIsSelected) {
        graph.removeNode(selectedEntity.id);
        console.log("deleting node");
        attributesContext.changeToNoContext();
      }
      else {
        graph.removeLink(selectedEntity.id);
        console.log("deleting link");
        attributesContext.changeToNoContext();
      }

      modelUpdater.updateVisualModel(graph.getData()); //TODO: validate model
    }
  }

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
    // graph.addDisconnectedLink(200, 300, {name : "associates"});


    // var link = graph.addDisconnectedLink(400, 300, {name : "cohorts"});
    // graph.joinLinkToNode(link, barneyNode, false);
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
    // var link = graph.addDisconnectedLink(400, 300, {name : "cohorts"});
    // graph.joinLinkToNode(link, markusNode, false);
  }

  // demo1();
  // demo2();
 
  demo3();
}

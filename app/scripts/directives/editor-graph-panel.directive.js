'use strict';

// The Editor graph panel directive is mainly responsible for the presentation and updating of the visual
// model. 
var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile) {
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
      		
      		// TODO: Make attributes context and model updater service
          // TODO: Make RAPTIDE API service 

          //TODO: fix so that this is not hard coded
          //TODO: move the graph initialization to the link
          editorGraph = new myGraph("#layout_layout_panel_main > div.w2ui-panel-content", 1500, 1500);
  			  editorOb = new editor(editorGraph);

          $timeout(function() {
            // TODO: Authenticate session
            // TODO: Initialise session with the initial POST request to the RAPTIDE API
            // TODO: validate model
          });
      	}, 1000); 

      //TODO: Update the editor graph when the attributes are modified
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
    //TODO: Implement method stub
  }

  // Handles right click on canvas event.
  var canvasRightClick = function(point) {
    //TODO: Implement method stub

  }

  // Handles mouse down on node event.
  // Selects node and binds the attributes panel scope to the attributes of 
  // this node.
  var nodeMouseDown = function(node) {    
    //TODO: Implement method stub
  }

  // Handles mouse up on node event.
  // Resets node is being dragged state.
  var nodeMouseUp = function(node) {
    //TODO: Implement method stub
  }

  // Handles node Right Click event.
  // Creates link between previouse node selection (made with left click) and current selection (made with right click)
  var nodeRightClick = function(node) {
    //TODO: Implement method stub
  }

  // Handles mouse down on link event. 
  // Selects link and binds the attributes panel scope to the attributes of 
  // this link. 
  var linkMouseDown = function(link) {
    //TODO: Implement method stub
  }

  // Handles canvaas delete key event.
  // Deletes selected entity.
  var canvasDeleteKeyDown = function() {
    //TODO: Implement method stub
  }

}

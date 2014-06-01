'use strict';

// The Editor graph panel directive is mainly responsible for the presentation and updating of the visual
// model. 
var app = angular.module('frontendApp.directives.editorGraphPanel', [])
  .directive('editorGraphPanel', function($compile, attributesContext, raptideAPIHTTP, modelUpdater,
                                            paletteSelection) {

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
			  editorOb = new editor(editorGraph, attributesContext, modelUpdater, paletteSelection);

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
function editor(graph, attributesContext, modelUpdater, paletteSelection) {  

  // Defines the events that can be dispatched by the graph
  graph.dispatch = d3.dispatch("canvasMouseDown", "canvasRightClick", 
                    "nodeMouseDown", "nodeMouseUp", "nodeRightClick", "linkMouseDown",
                    "canvasDeleteKeyDown");

  var _self = this;
  var selectedEntity, previouselySelectedEntity = null;
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
  // Create node on the svg canvas where the user clicked if a node palette option is 
  // currently selected.
  var canvasMouseDown = function(point) {

    if(paletteSelection.selectedOption.optionIsNode === true) {
      // previouselySelectedEntity = null; 

      nodeIsSelected = true; 
      var attributes; 

      switch(paletteSelection.selectedOption.optionType) {
        case "screenNode":
          attributes = {
                      "isTab": false,
                      "tabLabel": "",
                      "screenLabel": "",
                      "name": "Screen Name",
                      "apiDomain": "",
                      "layoutItems": [{
                              "viewType": "",
                              "value": ""
                            }]
                    }
          break;

        case "appPropertiesNode":
          attributes = {
                      "navigationType": "None",
                      "appName": "App Name",
                      "icon": ""
                    };
          break;

        default:
          //Assert 
          attributes = {};
          break;
      }


      selectedEntity = graph.addNode(point[0], point[1], attributes, paletteSelection.selectedOption.optionType );
      
      modelUpdater.updateVisualModel(graph.getData()); //TODO: validate model
      attributesContext.changeContext(selectedEntity, nodeIsSelected );
    }
  }

  // Handles right click on canvas event.
  var canvasRightClick = function(point) {
    // selectedEntity = graph.addDisconnectedLink(point[0], point[1] );
    // nodeIsSelected = true;
    // attributesContext.changeContext(selectedEntity, nodeIsSelected );

  }

  // Handles mouse down on node event.
  // Selects node and binds the attributes panel scope to the attributes of 
  // the selected node.
  // Also, if a link palette option is selected this performs the add link
  // mechanism, by storing the previouse node that has been selected and 
  // then adding a link after a different node is selected. 
  var nodeMouseDown = function(node) {    
    
    if(paletteSelection.selectedOption.optionIsNode === true) {
      previouselySelectedEntity = null;
    }

    if(node !== selectedEntity) {
      nodeIsSelected = true;
      nodeIsBeingDragged = true;

      selectedEntity = node;
      attributesContext.changeContext(selectedEntity, nodeIsSelected );

      if(paletteSelection.selectedOption.optionIsNode === false) {

        if(previouselySelectedEntity !== null ) {
          var attributes; 

          switch(paletteSelection.selectedOption.optionType) {
            case "screenTransitionLink":
              attributes = { condition: "none"}
              break;
            default:
              //Assert 
              attributes = {};
              break;
          }

          graph.addLink(previouselySelectedEntity, node, attributes, paletteSelection.selectedOption.optionType );
          modelUpdater.updateVisualModel(graph.getData()); //TODO: validate model
          previouselySelectedEntity = null;

        } else {
          previouselySelectedEntity = node;
        }
      }
    }
  }

  // Handles mouse up on node event.
  // Resets node is being dragged state.
  var nodeMouseUp = function(node) {

    nodeIsBeingDragged = false;
  }

  // Handles node Right Click event.
  var nodeRightClick = function(node) {

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
}

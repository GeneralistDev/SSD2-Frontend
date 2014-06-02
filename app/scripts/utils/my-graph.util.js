'use strict';

// myGraph provides a simple interface to the D3 force layout.
// It's mainly responsible for presenting the visual model to the user in a graphlike form
// and dispatching user interaction events with the varioues nodes and links to the editor
// graph object.
function myGraph(rootElement, width, height) {

  // var selection = new selectionManager();
  var dispatch;
  var _self = this;

  var nodeCount = this.nodeCount = 0;
  var linkCount = this.linkCount = 0;

  var nodeImageProperties = nodeImageProperties = {};
  var nodeTextProperties = nodeTextProperties = {};

  // Strips out the nodes and links visual data. 
  this.getData = function() {
    var pNodes = [];
    var pLinks = [];

    for( var i = 0; i < nodes.length; i++) {
      pNodes.push({ id : nodes[i].id,
                    nodeType : nodes[i].nodeType,
                    attributes : nodes[i].attributes
                  });
    }

    for( var j = 0; j < links.length; j++) {
      pLinks.push( { id : links[j].id,
                     linkType : links[j].linkType,
                     attributes : links[j].attributes,
                     sourceID : links[j].sourceID,
                     targetID : links[j].targetID  
      });
    }

    return {nodes : pNodes, links : pLinks}
  }

  // Add and remove elements on the graph object
  this.addNode = function (x, y, attributes, nodeType, id) {
    x = x;
    y = y;
    id = id || ("" + (++nodeCount));
    nodeType = nodeType || "default";

    attributes = attributes || {name : " "};

    //view or presenter code
    var visualProperites = getNodeVisualProperties(nodeType, attributes); 

    nodeImageProperties["id_"+id] = visualProperites.imageProperties;
    nodeTextProperties["id_"+id] = visualProperites.textProperties;

    var node = {
        "id":id,
        "fixed": true,
        "x": x,
        "y": y,
        "nodeType" : nodeType, //TODO: remove view code
        "attributes" : attributes,
        "imageX" : visualProperites.imageProperties.x,
        "imageY" : visualProperites.imageProperties.y,
        "imagePath" : visualProperites.imageProperties.imagePath, 
        "imageWidth" : visualProperites.imageProperties.width, 
        "imageHeight" : visualProperites.imageProperties.height, 
        "textValue" : visualProperites.textProperties.textValue,
      };

    nodes.push(node);
    update();

    return node;
  }

  // Removes the node which corresponds to the given ID from the graph
  this.removeNode = function (id) {
    var i = 0;
    var nodeToRemove = findNode(id);
    var endPoint;
    console.log(nodeToRemove);

    var associatedLinks = findLinks("", nodeToRemove.id );
    
    for(var i in associatedLinks) {

      _self.removeLink(associatedLinks[i].id);
    }

    nodeCount--;

    nodes.splice(findNodeIndex(id),1); //removes old node
    update();
  }

  // Removes a link which coresponds to the given ID from the graph
  this.removeLink = function (id) {

    linkCount--;
    console.log("removing link with id:" + id);
    links.splice(findLinkIndex(id),1);

    update();
  }

  // Adds a new link to the graph 
  this.addLink = function (source, target, attributes, linkType, linkID) {
      linkType = linkType || "default";

      linkID = linkID || ("" + (++linkCount));
      attributes = attributes || {name : "default"};

      var link = {
        "id": linkID,
        "source":source,
        "target":target,
        "sourceID" : source.id,
        "targetID" : target.id,
        "linkType" : linkType,
        "attributes" : attributes
      };

      links.push(link);
      
      update();

      return link;
  }

  // Experimental code. Do not use.
  // Adds a link that is not connected to any formally declared nodes.
  // This is achieved by creating two special end point nodes that are not
  // visible(and are not considered in the model) so that the link can be 
  // moved to the appropriate place.
  this.addDisconnectedLink = function (x, y, attributes, linkType, linkID) {
    var defaultLen = 50; //TODO: determine using linkType and configs
    var sourceX = x - (defaultLen / 2); 
    var sourceY = y - (defaultLen / 2); 

    var targetX = x + (defaultLen / 2); 
    var targetY = y - (defaultLen / 2); 
    

    var source = _self.addNode(sourceX,sourceY, "", "disconnected-link-node" );
    source.isTarget = false;

    var target = _self.addNode(targetX, targetY, "", "disconnected-link-node");
    target.isSource = true;

    var newLink = _self.addLink(source, target, attributes, linkType, linkID);  

    return newLink;
  }

  // Experimental code. Do not use.
  // Removes old node
  this.joinLinkToNode = function (link, nodeToJoin, isTarget) {

    if(isTarget === true) {

      link.target = nodeToJoin;
      link.targetID = nodeToJoin.id;
    } else {

      link.source = nodeToJoin;
      link.sourceID = nodeToJoin.id;
    }   

    // _self.refreshLink(link);

    linkCount--;
    links.splice(findLinkIndex(link.id),1);
    update();
    
    _self.addLink(link.source, link.target, link.attributes, link.linkType, link.id);
    update();

    return link;
  }

  // Refreshes the node visuals
  this.refreshNode = function(node) {

    d3.select("[id='node_text_ " + node.id + "']").text(function() {
        return node.attributes.name; //TODO: modify text based on node type
      });

    // if(node.attributes.nodeType === "screenNode") {

    //   if(node.attributes.isTab && (node.attributes.apiDomain !== "") {
    //     node.imagePath = "images/<>.svg"; //TODO: modify text based on node type

    //   } else if(node.attributes.isTab) {
    //     node.imagePath = "images/<>.svg"; //TODO: modify text based on node type

    //   }
    //   else if(node.attributes.apiDomain !== "") {
    //     node.imagePath = "images/<>.svg";

    //   } else {
    //     node.imagePath = "images/DefaultScreenIcon.svg"; //Default

    //   }

    //   var image = d3.select("[id='node_image_ " + node.id + "']");

    //   image.attr("xlink:href", function(d) {
    //       return d.imagePath;
    //   })

    // Find the visuals
    // update visuals
    // nodeCount--;
    // nodes.splice(findNodeIndex(node.id),1);
    // update();
    
    // _self.addNode(node.x, node.y, node.attributes, node.nodeType, node.id);
    // update();
  }

  // Refreshes link visuals
  this.refreshLink = function(link) {
    d3.select("[id='link_label_"+ link.id + "']").text(function() {
        console.log("refreshLink got here!");
        return link.attributes.condition; //TODO: modify text based on link type
      });
  }

  // Returns the node for the given nodeID
  var findNode = function(id) {
      for (var i in nodes) {
        if (nodes[i]["id"] === id) 
          return nodes[i];
      };
  }

  // Returns a list of links pertaining to the linkID.
  // Also it provides all the links attatched to a supplied node. 
  var findLinks = function(linkID, nodeID) {
    var plinks = [];
    if( typeof linkID !== undefined ){
      for (var i in links) {
        if (links[i]["id"] === linkID) {
          links.push(links[i]);
          break;
        }
      };
    }
    
    // Searches for any links that are associated with the nodeID.
    if(typeof nodeID !== undefined ) {
      for (var i in links) {
        if ((links[i].sourceID === nodeID) || (links[i].targetID === nodeID)) {
          plinks.push(links[i]);
        }
      };
    }

    return plinks;
  }

  // Searches through d3.force.nodes for a node with the coresponding id.
  var findNodeIndex = function(id) {
      for (var i in nodes) {if (nodes[i]["id"] === id) return i};
  }
  
  // Searches through d3.force.links for a link with the coresponding id.
  var findLinkIndex = function(id) {
      for (var i in links) {if (links[i]["id"] === id) return i};
  }
  
  // Extracts the width of the root element.
  this.getWidth = function(){
    return $(rootElement).width(); //TODO: refactor
  }

  // Extracts the height of the root element.
  this.getHeight = function(){
    return $(rootElement).height(); //TODO: refactor
  }

  // Analyses the node's attributes and returns a list of visual properties that can be bound
  // to the node DOM element.
  var getNodeVisualProperties = function(nodeType, attributes) {
    var textProperties = {};
    

    var imageProperties = { };

    // Assigning the image visual properties
    switch (nodeType) {
      case "appPropertiesNode" : 
        imageProperties.imagePath = "images/AppPropertiesIcon.svg";
        textProperties.textValue = "App Properties"; //TODO: infer from node type
        imageProperties.width = "120"; //TODO: fix so it is not hard coded
        imageProperties.height = "120";
        break;

      case "screenNode" : 
        imageProperties.imagePath = "images/DefaultScreenIcon.svg";
        textProperties.textValue = attributes.name; //TODO: infer from node type
        imageProperties.width = "120"; //TODO: fix so it is not hard coded
        imageProperties.height = "120";
        break;

      case "default" : 
        imageProperties.imagePath = "images/stick_figure.svg";

        imageProperties.width = "120";
        imageProperties.height = "120";
        break;
      default : //usually for disconnected link end points
        imageProperties.imagePath = "images/empty.svg";//blank svg image 

        imageProperties.width = "20";
        imageProperties.height = "20";
    }

    // Centers the image on the link
    imageProperties.x = imageProperties.width / -2 ; 
    imageProperties.y = imageProperties.height / -2;

    var result = {imageProperties : imageProperties, 
            textProperties : textProperties};

    return result;
  }

  // set up the D3 visualisation in the specified element
  //canvas default size is the size of the root element
  width = width || $(rootElement).innerWidth();
  height = height || $(rootElement).innerHeight();

  var vis = this.vis = d3.select(rootElement).append("svg:svg")
      .attr("width", function(){$(this).parent().width();})
      .attr("height", function(){$(this).parent().height();})
      .on('mousedown', function() {

        //stop showing browser menu
        d3.event.preventDefault();
        var point = d3.mouse(this);

        if(d3.event.which == 1) //left mouse button id
          _self.dispatch.canvasMouseDown(point);
        else if(d3.event.which == 3)  //right mouse button id
          _self.dispatch.canvasRightClick(point);
      })
      .on("contextmenu", function(data, index) {
        //stop showing browser menu
        // d3.event.preventDefault();
      });

  d3.select("body")
    .on("keydown", function() {
      if(d3.event.keyCode === 46) //delete key 
        _self.dispatch.canvasDeleteKeyDown();
    });

  var force = d3.layout.force()
      .gravity(.05)
      .size([$(rootElement).width(), $(rootElement).height()]);

  var nodes = force.nodes(),
      links = force.links();

  var drag = force.drag();

  // define arrow markers for graph links
  vis.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

  vis.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

  // Creates representations for any new nodes or links that have been added to d3.force 
  // and binds their appropriate visual properties to them. 
  var update = function () {
    var linkSelectBox = vis.selectAll("path.link-selectbox").data(links);
    
    // This is a selectable invisible box that is larger than the actual drawing of the link path
    // This is done to make it easier to select links.
    linkSelectBox.enter().insert("path")
        .attr("class", "link-selectbox")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("id", function(d) {
          return "link_selectbox "+d.id;
        })
        .on('mousedown', function(d){ // Binding the select event to the select box
          d3.event.stopPropagation();  // TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    var link = vis.selectAll("path.link")
        .data(links, function(d) { 
          return d.source.id + "-" + d.target.id; 
        });

    // Selects any new linkd data that does not already have a dom element
    // and creates link elements for them.
    var linkEnter = link.enter().insert("path") 
        .attr("class", "link")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("stroke-dasharray", function(d) {
          return [10,2];
        })
        .attr("id", function(d) {
          return "link_ "+d.id;
        })
        .style('marker-end', function(d) { return 'url(#end-arrow)'; })
        .on('mousedown', function(d){ // Binding the select event to the actual link path
          d3.event.stopPropagation();  //TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    // A element container that is relative to the link path
    // This contains the text lable.
    var linktext = vis.selectAll("g.linklabelholder").data(links); 
    
    // Creates the link label element
    linktext.enter().append("g").attr("class", "linklabelholder")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("id", function(d) {
          return "link_label_holder "+d.id;
        })
        .append("text")
        .attr("class", "link-label")
        .attr("id", function(d) {
          return "link_label_"+d.id;
        })
        .attr("dx", 1)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(function(d) { 
          if(d.attributes.condition !==  null) // Bind the text of the label to the element
            return d.attributes.condition; //TODO: show the primary relationship based on relationship type
          return "default " + d.id;
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  //TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    //Removes any links and/or link texts that have strayed to far from the canvas borders
    link.exit().remove(); 
    linktext.exit().remove();

    // Selects all existing link node DOM elements
    var node = vis.selectAll("g.node")
        .data(nodes, function(d) { 
          return d.id;
        });

    // Creates new node DOM elements for any new node data.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("id", function(d) {
          return "node_ "+d.id;
        })
        .on('mousedown', function(d){ //Binds the select event to the node
          d3.event.stopPropagation();  
        
          d3.event.preventDefault();

          if(d3.event.which == 1) //left mouse button id
            _self.dispatch.nodeMouseDown(d);
          else if(d3.event.which == 3)  //right mouse button id
            _self.dispatch.nodeRightClick(d);
          })
        .on('mouseup', function(d){ //Binds the mouse up event to the node
          // d3.event.stopPropagation();  
          _self.dispatch.nodeMouseUp(d);
        })
        .call(drag); //Makes the node draggable

    // Creates an image element which represents the node
    nodeEnter.append("image") 
        .attr("class", "node-image") 
        .attr("node-type", function(d) {

          return d.nodeType;
        }) 
        .attr("xlink:href", function(d, i) {
          return d.imagePath;
        })
        .attr("x", function(d){
          return d.imageX; 
        }) 
        .attr("y", function(d){
          return d.imageY; 
        })
        .attr("width", function(d) {
          return d.imageWidth; 
        })
        .attr("height", function(d) {
          return d.imageHeight;
        })
        .attr("id", function(d) {
          return "node_image_ "+d.id;
        });

    // Creates a label for the node
    nodeEnter.append("text")
        .attr("class", "node-text")
        .attr("dx", function(d){
          return "-40"; 
        }) 
        .attr("dy", function(d){
          return (d.imageY + (120) + 20); //TODO: fix so this isn't hard coded 
        }) 
        .attr("id", function(d) {
          return "node_text_ "+d.id;
        })
        .text(function(d) {
          return d.textValue;
        });

    // Removes any nodes that have strayed too far from the bounderies of the canvas    
    node.exit().remove();

    // When the force layout is ticked it makes positional changes to each of the link and node elements
    // in most cases this will simply result in the positions being updated on the screen.
    force.on("tick", function() {
      // link, linkSelectBox, linktext and node are arrays containing all of their elements.
      // Updates that are assigned to any of these structures propagate to all of their associated
      // elements

      // Updates the position of each of the links
      link.attr("d", function(d) {
            return "M" + 
              d.source.x + "," + 
              d.source.y + "L" + 
              d.target.x + "," + 
              d.target.y;
      });

      //select box has same path as link (though has a much larger stroke width)
      linkSelectBox.attr("d", function(d) {
        return "M" + 
          d.source.x + "," + 
          d.source.y + "L" + 
          d.target.x + "," + 
          d.target.y;
      });

      // Updates the position of the link text label
      linktext.attr("transform", function(d) {
        return "translate(" + (d.source.x + d.target.x) / 2 + "," 
                    + (d.source.y + d.target.y) / 2 + ")"; 
      });

      // Updates the position of the node
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    // Restart the force layout.
    force.start();
  }

  // Make it all go
  update();
}
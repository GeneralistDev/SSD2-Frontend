'use strict';

function myGraph(rootElement, width, height) {

  // var selection = new selectionManager();
  var dispatch;
  var _self = this;

  var nodeCount = this.nodeCount = 0;
  var linkCount = this.linkCount = 0;

  var nodeImageProperties = nodeImageProperties = {};
  var nodeTextProperties = nodeTextProperties = {};

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
        "textValue" : visualProperites.textProperties.textValue
      };

    nodes.push(node);
    update();

    return node;
  }

  this.removeNode = function (id) {
    var i = 0;
    var nodeToRemove = findNode(id);
    var endPoint;

    // Searches and replaces node with blank end point if node to delete is not an end point already
    if(nodeToRemove.nodeType !== "disconnected-link-node" ) {

      // Looks for node connected to link
      for(var i = 0; i < links.length; i++) {
        if ((links[i]['source']) == nodeToRemove) {

          // Adds new blank node end point
          endPoint = _self.addNode(nodeToRemove.x,nodeToRemove.y, "", "disconnected-link-node" );
          joinLinkToNode(links[i], endPoint, false );
          break;
        }
        else if((links[i]['target']) == nodeToRemove) {
          endPoint = _self.addNode(nodeToRemove.x,nodeToRemove.y, "", "disconnected-link-node" );
          joinLinkToNode(links[i], endPoint, true );
          break;
        }
      }
    }
    nodeCount--;

    nodes.splice(findNodeIndex(id),1); //removes old node
    update();
  }

  this.removeLink = function (id) {
    var linkToRemove = findLink(id);

    // Remove (unnecisary) end points if any 
    if(linkToRemove['source'].nodeType === "disconnected-link-node" ) {
      _self.removeNode(linkToRemove['source']);
    }

    if(linkToRemove['target'].nodeType === "disconnected-link-node" ) {
      _self.removeNode(linkToRemove['target']); 
    }

    linkCount--;

    links.splice(findLinkIndex(id),1);
    update();
  }

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
    source.link = newLink;
    target.link = newLink;
  }

  this.joinLinkToNode = function (link, nodeToJoin, isTarget) {

    var nodeToRemove;

    if(isTarget === true) {
      _self.removeNode(link.target.id);
      link.target = nodeToJoin;
      link.targetID = nodeToJoin.id;
    }
    else {
      _self.removeNode(link.source.id); //bug node not deleting
      link.source = nodeToJoin;
      link.sourceID = nodeToJoin.id;
    }   


    removeLink(link.id);
    
    update();
    addLink(link.source, link.target, link.attributes, link.linkType, link.id);
    update();

    return link;
  }

  var findNode = function(id) {
      for (var i in nodes) {
        if (nodes[i]["id"] === id) 
          return nodes[i];
      };
  }

  var findLink = function(linkID, nodeID) {
    if( typeof linkID !== undefined ){
      for (var i in links) {
        if (links[i]["id"] === linkID) 
          return links[i];
      };
    }
    else if(typeof nodeID !== undefined ) {
      for (var i in links) {
        if ((links[i]["source"] === nodeID) || (links[i]["target"] === nodeID))
          return links[i];
      };
    }
  }

  var findNodeIndex = function(id) {
      for (var i in nodes) {if (nodes[i]["id"] === id) return i};
  }

  this.getWidth = function(){
    return $(rootElement).width();
  }

  this.getHeight = function(){
    return $(rootElement).height();
  }

  var getNodeVisualProperties = function(nodeType, attributes) {
    var textProperties = {};
    textProperties.textValue = attributes.name; //TODO: infer from node type

    var imageProperties = { };


    switch (nodeType) {
      case "person" : 
        imageProperties.imagePath = "images/stick_figure.svg";

        imageProperties.width = "70";
        imageProperties.height = "70";
        break;
      case "disconnected-link-node" :
        imageProperties.imagePath = "images/disconnected_link_node.svg";

        imageProperties.width = "20";
        imageProperties.height = "20";
        break;
      case "default" : 
        imageProperties.imagePath = "images/stick_figure.svg";

        imageProperties.width = "70";
        imageProperties.height = "70";
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

  var force = d3.layout.force()
      .gravity(.05)
      .size([$(rootElement).width(), $(rootElement).height()]);

  var nodes = force.nodes(),
      links = force.links();

  var drag = force.drag();

  var update = function () {
    var linkSelectBox = vis.selectAll("path.link-selectbox").data(links);
    
    linkSelectBox.enter().insert("path")
        .attr("class", "link-selectbox")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("id", function(d) {
          return "link_selectbox "+d.id;
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  //TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    var link = vis.selectAll("path.link")
        .data(links, function(d) { 
          return d.source.id + "-" + d.target.id; 
        });

    var linkEnter = link.enter().insert("path")
        .attr("class", "link")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("id", function(d) {
          return "link_ "+d.id;
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  //TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    var linktext = vis.selectAll("g.linklabelholder").data(links);
    
    linktext.enter().append("g").attr("class", "linklabelholder")
        .attr("link-type",  function(d) {
          return d.linkType;
        }) 
        .attr("id", function(d) {
          return "link_label_holder "+d.id;
        })
        .append("text")
        .attr("class", "link-label")
        .attr("dx", 1)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(function(d) { 
          if(d.attributes.name !==  null)
            return d.attributes.name; //TODO: show the primary relationship based on relationship type
          return "default " + d.id;
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  //TODO: fix precision problem
          _self.dispatch.linkMouseDown(d);
        });

    link.exit().remove();
    linktext.exit().remove();

    var node = vis.selectAll("g.node")
        .data(nodes, function(d) { 
          return d.id;
        });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("id", function(d) {
          return "node_ "+d.id;
        })
        .on("dblclick", function(d) {
           _self.dispatch.nodeDoubleClick(d);
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  
          _self.dispatch.nodeMouseDown(d);
        })
        .on('mouseup', function(d){
          // d3.event.stopPropagation();  
          _self.dispatch.nodeMouseUp(d);
        })
        .call(drag);

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
        });

    nodeEnter.append("text")
        .attr("class", "node-text")
        .attr("dx", ".35em") 
        .attr("dy", 80)
        .attr("id", function(d) {
          return "node_text_ "+d.id;
        })
        .text(function(d) {
          return d.textValue;
        });

    //removes any nodes that have     
    node.exit().remove();

    force.on("tick", function() {

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

      linktext.attr("transform", function(d) {
      return "translate(" + (d.source.x + d.target.x) / 2 + "," 
      + (d.source.y + d.target.y) / 2 + ")"; });

      /*node.attr("cx", function(d) {return d.x; })
          .attr("cy", function(d) {return d.y; });*/

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    // Restart the force layout.
    force.start();
  }



  // Make it all go
  update();
}
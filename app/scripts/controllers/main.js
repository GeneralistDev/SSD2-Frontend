'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope, $compile, $timeout, $document) {

    $scope.attributes = {
      name: "red"
    };

    $scope.attributesChangeHandler = function() {
      console.log("attributesChangeHandler");
      editorOb.refresh();
    }

    $scope.submit = function() {
      // $window.alert("submitted!");
      // $scope.attributes.name = "fred";
      editorOb.refresh();

    }

    $scope.submitFred = function() {
      $window.alert("submitted!");
    }

    $().w2destroy('layout');
    var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
    $('#layout').w2layout({
      name: 'layout',
      panels: [
          { type: 'left',  size: 200, resizable: true, style: pstyle, content: 'palette' },
          { type: 'main', size: 600, resizable: true, style: pstyle  },
          { type: 'bottom',  size: 200, resizable: true, style: pstyle, content: 'DSL' },
          { type: 'right',  size: 200, resizable: true, style: pstyle, content: 'preview' }
        ]
      }); // End layout

    $().w2destroy('rightPanelLayout');

    $().w2layout({
      name: 'rightPanelLayout',
      panels: [
        { type: 'main', style: pstyle, content: 'main',size: '50%',resizable: true},
        { type: 'preview', size: '50%', resizable: true, style: pstyle, content: 'main.htm' }
      ]
    });
    
    w2ui['layout'].content('right', w2ui['rightPanelLayout']);
    // w2ui['rightPanelLayout'].load('main', 'views/attributes_panel.html');

    var editorOb;

    $scope.$on('$routeChangeSuccess', function() {

      //injects the attributes html into the attributes panel
      $timeout(function() {
        //compiles and binds the angular code for the attributes
        $("#layout_rightPanelLayout_panel_main > div.w2ui-panel-content").html(
          $compile(
            "<form>Name: <input type='text' name='attributeName' ng-model='attributes.name' ng-change='attributesChangeHandler()'></form>"
          )($scope));
        $scope.$apply();
      });


      var editorGraph = new myGraph('#layout_layout_panel_main > div.w2ui-panel-content', 1500, 1500);
      editorOb = new editor(editorGraph);
    }); // End scope Event

    //call this if modifying the scope from outside of the controller
    $scope.apply = function() {
      $scope.$apply();
    }
  });

function editor(graph) {  
  var scope = angular.element('#root').scope();  
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

    scope.attributes.name = selectedEntity.name;
    scope.apply();
  })
  .on("linkMouseDown", function(link){
    console.log("link clicked"+ link.id);
    nodeIsSelected = false;
    selectedEntity = link;

    scope.attributes.name = selectedEntity.name;
    scope.apply();
  })
  
  this.refresh = function(attributes) {
    console.log("changing");

    if( nodeIsSelected )
    {
      graph.removeNode(selectedEntity.id);
      graph.addNode(scope.attributes.name, selectedEntity.x, selectedEntity.y, selectedEntity.id );
    }
    else
    {
      graph.removeLink(selectedEntity.id);
      graph.addLink( selectedEntity.source, selectedEntity.target, scope.attributes.name, selectedEntity.id );
    }
  }
}

function myGraph(rootElement, width, height) {

  // var selection = new selectionManager();
  var dispatch;
  var _self = this;
  var nodeCount = this.nodeCount = 0;

  // Add and remove elements on the graph object
  this.addNode = function (name, x, y, id) {
    x = x;
    y = y;
    id = id || (" " + (++nodeCount));
    
    name = name || (" ");
    var node = {
        "id":id,
        "fixed": true,
        "x": x,
        "y": y,
        "name": name
      };

      nodes.push(node);
      update();

      return node;
  }

  this.removeNode = function (id) {
      var i = 0;
      var n = findNode(id);

      while (i < links.length) {
        if ((links[i]['source'] == n)||(links[i]['target'] == n)) 
          links.splice(i,1);
        else i++;
      }

      nodeCount--;

      nodes.splice(findNodeIndex(id),1);
      update();
  }

  this.addLink = function (sourceID, targetID, name, linkID) {
      name = name || " ";
      var link = {
        "source":sourceID,
        "target":targetID,
        "name": name,
        "id": linkID,
        "fixed": true
      };

      links.push(link);
      
      update();

      return link;
  }

  var findNode = function(id) {
      for (var i in nodes) {
        if (nodes[i]["id"] === id) 
          return nodes[i];
      };
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

  // set up the D3 visualisation in the specified element
  //canvas default size is the size of the root element
  width = width || $(rootElement).innerWidth();
  height = height || $(rootElement).innerHeight();

  var vis = this.vis = d3.select(rootElement).append("svg:svg")
      .attr("width", function(){$(this).parent().width();})
      .attr("height", function(){$(this).parent().height();})
      .on('mousedown', function() {
        var point = d3.mouse(this);
        _self.dispatch.canvasMouseDown(point);
      });

  var force = d3.layout.force()
      .gravity(.05)
      .size([$(rootElement).width(), $(rootElement).height()]);

  var nodes = force.nodes(),
      links = force.links();

  var drag = force.drag();

  var update = function () {
    //transforming stuff?? VVV
    var link = vis.selectAll("line")
        .data(links, function(d) { 
          return d.source.id + "-" + d.target.id; 
        });

    var linkEnter = link.enter().append("line")
        .attr("class", "link")
        .attr("id", function(d) {
          return "link_ "+d.id;
        })
        .on('mousedown', function(){
          d3.event.stopPropagation();  
          _self.dispatch.linkMouseDown(d);
        })

    linkEnter.append("text")
        .attr("class", "linktext")
        .attr("dx", ".35em")
        .attr("dy", 80)
        .attr("id", function(d) {
          return "link_text_ "+d.id;
        })
        .text(function(d) {
          return d.id;
        });

    link.exit().remove();

    var node = vis.selectAll("g.node")
        .data(nodes, function(d) { 
          return d.id;
        });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("id", function(d) {
          return "node_ "+d.id;
        })
        .on('mousedown', function(d){
          d3.event.stopPropagation();  
          _self.dispatch.nodeMouseDown(d);
        })
        .call(drag);

    nodeEnter.append("image")
        .attr("class", "circle")
        .attr("xlink:href", "images/stick_figure.svg")
        .attr("x", "-8px")
        .attr("y", "-8px")
        .attr("width", "70")
        .attr("height", "70");

    nodeEnter.append("text")
        .attr("class", "nodetext")
        .attr("dx", ".35em")
        .attr("dy", 80)
        .attr("id", function(d) {
          return "node_text_ "+d.id;
        })
        .text(function(d) {
          return d.name;
        });

    //removes any nodes that have     
    node.exit().remove();

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

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
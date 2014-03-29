'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($window, $scope) {

    $scope.submit = function() {
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

    $scope.$on('$routeChangeSuccess', function() {

      var graph = new myGraph('#layout_layout_panel_main > div.w2ui-panel-content', 1500, 1500);
      
      graph.addNode("Cause");
      graph.addNode("Effect");

      graph.addLink("Cause", "Effect", "fred");
      
      d3.select(graph.vis).onclick = function() {
        graph.addNode("fred", d3.mouse(this)[0], d3.mouse(this)[0]);
      };
    }); // End scope Event
  });

function myGraph(rootElement, width, height) {

  // Add and remove elements on the graph object
  this.addNode = function (id, x, y) {
    x = x || (width / 2);
    y = y || (height / 2);
    id = id || (nodes.size + 1);
      nodes.push({
        "id":id,
        "fixed": true});
      update();
  }

  this.removeNode = function (id) {
      var i = 0;
      var n = findNode(id);

      while (i < links.length) {
        if ((links[i]['source'] == n)||(links[i]['target'] == n)) 
          links.splice(i,1);
        else i++;
      }

      nodes.splice(findNodeIndex(id),1);
      update();
  }

  this.addLink = function (source, target, id) {
      links.push({
        "source":findNode(source),
        "target":findNode(target),
        "id": id,
        "fixed": true
      });
      
      update();
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

  // set up the D3 visualisation in the specified element
  //canvas default size is the size of the root element
  width = width || $(rootElement).innerWidth();
  height = height || $(rootElement).innerHeight();

  var vis = this.vis = d3.select(rootElement).append("svg:svg")
      .attr("width", width)
      .attr("height", height);

  var force = d3.layout.force()
      .gravity(.05)
      .size([width, height]);

  var nodes = force.nodes(),
      links = force.links();

  var update = function () {
    //transforming stuff?? VVV
    var link = vis.selectAll("line")
        .data(links, function(d) { 
          return d.source.id + "-" + d.target.id; 
        });

    var linkEnter = link.enter().append("line")
        .attr("class", "link");

    linkEnter.append("text")
        .attr("class", "linktext")
        .attr("dx", ".35em")
        .attr("dy", 80)
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
        .call(force.drag);

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
        .text(function(d) {
          return d.id;
        });

    //removes any nodes that have     
    node.exit().remove();

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    // Restart the force layout.
    force.start();
  }

  // Make it all go
  update();
}
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
      var width = 1500,
          height = 1500;

      //Original data
      var dataset = {
        nodes: [
          { name: "Adam", fixed: true },
          { name: "Bob", fixed: true },
          { name: "Carrie", fixed: true },
          { name: "Donovan", fixed: true },
          { name: "Edward", fixed: true },
          { name: "Felicity", fixed: true },
          { name: "George", fixed: true },
          { name: "Hannah", fixed: true },
          { name: "Iris", fixed: true },
          { name: "Jerry",
            fixed: true }
        ],
        edges: [
          { source: 0, target: 1 },
          { source: 0, target: 2 },
          { source: 0, target: 3 },
          { source: 0, target: 4 },
          { source: 1, target: 5 },
          { source: 2, target: 5 },
          { source: 2, target: 5 },
          { source: 3, target: 4 },
          { source: 5, target: 8 },
          { source: 5, target: 9 },
          { source: 6, target: 7 },
          { source: 7, target: 8 },
          { source: 8, target: 9 }
        ]
      };

          //Initialize a default force layout, using the nodes and edges in dataset
      var force = d3.layout.force()
                 .nodes(dataset.nodes)
                 .links(dataset.edges)
                 .size([width, height])
                 .linkDistance([50])
                 .start();

      var colors = d3.scale.category10();

      // var canvas = d3.select('#layout_layout_panel_main > div.w2ui-panel-content').append('canvas')
      //     .attr('width', width)
      //     .attr('height', height);

      var svg = d3.select('#layout_layout_panel_main > div.w2ui-panel-content')
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

      //adding new nodes              
      svg.on('mousedown', function() {
        var point = d3.mouse(this);
        var node = {x: point[0]
          , y :point[1]};  
        dataset.nodes.push(node);
        // refresh();    

        force.nodes(dataset.nodes);
        force.start();
        //Create nodes as circles
        var nodes = svg.selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 10)
                    .style("fill", function(d, i) {
                      return colors(i);
                    })
                    .call(force.drag);
      });

      //Create edges as lines
      var edges = svg.selectAll("line")
                  .data(dataset.edges)
                  .enter()
                  .append("line")
                  .style("stroke", "#ccc")
                  .style("stroke-width", 1);
      
      //Create nodes as circles
      var nodes = svg.selectAll("circle")
                  .data(dataset.nodes)
                  .enter()
                  .append("circle")
                  .attr("r", 10)
                  .style("fill", function(d, i) {
                    return colors(i);
                  })
                  .call(force.drag);

      //Every time the simulation "ticks", this will be called
      force.on("tick", function() {

        edges.attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });
      
        nodes.attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });

      }); //End D3 code
    }); // End scope Event
  });
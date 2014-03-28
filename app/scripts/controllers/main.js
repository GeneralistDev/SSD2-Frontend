'use strict';

angular.module('frontendApp')
    .controller('MainCtrl', function ($window, $scope) {
      
      $scope.person = 'george';

      $scope.submit = function() {
        $window.alert("submitted!");
      }
        $().w2destroy('layout');
        var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
        $('#layout').w2layout({
          name: 'layout',
          panels: [
              { type: 'left',  size: 200, resizable: true, style: pstyle, content: 'palette' },
              { type: 'main', size: 600, resizable: true, style: pstyle,  },
              { type: 'bottom',  size: 200, resizable: true, style: pstyle, content: 'DSL' },
              { type: 'right',  size: 200, resizable: true, style: pstyle, content: 'preview' }
            ]
          }); // End layout

        $().w2destroy('rightPanelLayout');

        $().w2layout({
          name: 'rightPanelLayout',
          panels: [
            { type: 'main', style: pstyle, content: 'main',size: '50%',resizable: true,},
            { type: 'preview', size: '50%', resizable: true, style: pstyle, content: 'main.htm' },
          ]
        });
        
        w2ui['layout'].content('right', w2ui['rightPanelLayout']);

        $scope.$on('$routeChangeSuccess', function(){
            

          var width = 1500,
              height = 1500;

          var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
              root = nodes[0];

          root.radius = 0;
          root.fixed = true;

          var force = d3.layout.force()
              .gravity(0.05)
              .charge(function(d, i) { return i ? 0 : -2000; })
              .nodes(nodes)
              .size([width, height]);

          force.start();

          var canvas = d3.select('#layout_layout_panel_main > div.w2ui-panel-content').append('canvas')
              .attr('width', width)
              .attr('height', height);

          var context = canvas.node().getContext('2d');

          force.on('tick', function(e) {
            var q = d3.geom.quadtree(nodes),
                i,
                d,
                n = nodes.length;

            for (i = 1; i < n; ++i) {q.visit(collide(nodes[i]));}

            context.clearRect(0, 0, width, height);
            context.fillStyle = 'steelblue';
            context.beginPath();
            for (i = 1; i < n; ++i) {
              d = nodes[i];
              context.moveTo(d.x, d.y);
              context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
            }
            context.fill();
          });

          canvas.on('mousemove', function() {
            var p1 = d3.mouse(this);
            root.px = p1[0];
            root.py = p1[1];
            force.resume();
          });

          function collide(node) {
            var r = node.radius + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                  l = (l - r) / l * .5;
                  node.x -= x *= l;
                  node.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        } // End D3 Code
      }); // End scope Event
    });
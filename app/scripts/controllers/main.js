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
    });
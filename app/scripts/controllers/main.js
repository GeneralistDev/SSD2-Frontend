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
      $window.alert("submitted!");
      // $scope.attributes.name = "fred";
      // editorOb.refresh();

    }



    // $().w2destroy('layout');
    // var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
    // $('#layout').w2layout({
    //   name: 'layout',
    //   panels: [
    //       { type: 'left',  size: 200, resizable: true, style: pstyle, content: 'palette' },
    //       { type: 'main', size: 600, resizable: true, style: pstyle  },
    //       { type: 'bottom',  size: 200, resizable: true, style: pstyle, content: 'DSL' },
    //       { type: 'right',  size: 200, resizable: true, style: pstyle, content: 'preview' }
    //     ]
    //   }); // End layout

    // $().w2destroy('rightPanelLayout');

    // $().w2layout({
    //   name: 'rightPanelLayout',
    //   panels: [
    //     { type: 'main', style: pstyle, content: 'main',size: '50%',resizable: true},
    //     { type: 'preview', size: '50%', resizable: true, style: pstyle, content: 'main.htm' }
    //   ]
    // });
    
    // w2ui['layout'].content('right', w2ui['rightPanelLayout']);
    // w2ui['rightPanelLayout'].load('main', 'views/attributes_panel.html');
    // // $scope.$apply();
    // var editorOb;

    // $scope.$on('$routeChangeSuccess', function() {

    //   //injects the attributes html into the attributes panel
    //   $timeout(function() {
    //     $compile($("#layout_rightPanelLayout_panel_main > div.w2ui-panel-content"))($scope);
    //     $scope.$apply();
    //     // //compiles and binds the angular code for the attributes
    //     // $("#layout_rightPanelLayout_panel_main > div.w2ui-panel-content").html(
    //     //   $compile(
    //     //     "<form>Name: <input type='text' name='attributeName' ng-model='attributes.name' ng-change='attributesChangeHandler()'></form>"
    //     //   )($scope));
    //     // $scope.$apply();
    //   });


    //   var editorGraph = new myGraph('#layout_layout_panel_main > div.w2ui-panel-content', 1500, 1500);
    //   editorOb = new editor(editorGraph);
    // }); // End scope Event

    //call this if modifying the scope from outside of the controller
    $scope.apply = function() {
      $scope.$apply();
    }
  });


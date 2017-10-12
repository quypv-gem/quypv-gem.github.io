angular.module('MatchLandTool', [])
.controller('MainController', ['$scope', function($sc){
  $sc.config = {
    width : 7,
    height : 5
  }
  $sc.board = [];
  $sc.picker = axe;

  $sc.maxtrix = new Matrix($sc.config.width, $sc.config.height);

  setTimeout(function(){
    $sc.board = $sc.maxtrix.toArray();
    $sc.$apply();
  }, 50);

  $sc.pickAxe = function() {
    this.picker = axe;
  }
  $sc.pickSword = function() {
    this.picker = sword;
  }
  $sc.pickSpear = function() {
    this.picker = spear;
  }
  $sc.pickHeart = function() {
    this.picker = heart;
  }
  $sc.pickStaff = function() {
    this.picker = staff;
  }

  $sc.dropType = function(block) {
    block.type = $sc.picker;
  }

}]);


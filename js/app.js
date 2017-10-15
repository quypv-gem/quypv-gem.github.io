angular.module('MatchLandTool', [])
.controller('MainController', ['$scope', function($sc){
  $sc.config = {
    width : 7,
    height : 5
  }
  $sc.board = [];
  $sc.picker = axe;

  $sc.matrix = new Matrix($sc.config.width, $sc.config.height);

  setTimeout(function(){
    $sc.board = $sc.matrix.toArray();
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
  $sc.pickBow = function() {
    this.picker = bow;
  }
  $sc.pickLock = function() {
    this.picker = lock;
  }

  $sc.dropType = function(block) {
    block.type = $sc.picker;
    block.displayType = $sc.picker;
  }

  $sc.solve = function() {
    this.matrix.solve();
  }

  $sc.reset = function() {
    this.matrix.reset();
  }

  $sc.next = function() {
    this.matrix.next();
  }

  $sc.test = function() {
    this.matrix.dump();
  }

}]);


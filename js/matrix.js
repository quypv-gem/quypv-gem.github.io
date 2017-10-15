class Matrix {
  constructor(width, height){
    this.root = new Block();
    this.width = width;
    this.height = height;
    this.solveTimes = 0;
    
    this.create();
  }

  create() {
    var iterR = this.root;
    var iterB = this.root;
    
    for (var i=0; i<this.width; i++) {
      if (i > 0) iterR = iterR.addRight();
      
      iterB = iterR;
      for (var k=1; k<this.height; k++) {
        iterB = iterB.addBottom();
      }
    }
  }

  toArray() {
    var iterR = this.root;
    var iterB = this.root;
    var arr = [];

    for (var i=0; i<this.height; i++) {
      var row = [];
      if (i > 0) iterB = iterB.bottom;

      iterR = iterB;
      row.push(iterR);
      for (var k=1; k<this.width; k++) {
        iterR = iterR.right;
        row.push(iterR);
      }

      arr.push(row);
    }

    return arr;
  }

  solve() {
    do {
      var bestMoveBlock = null;
      var bestPoint = 1;
      this.travel(function(block){
        block.resetEvaluate();
        if(block.evaluate() > bestPoint) {
          bestMoveBlock = block;
          bestPoint = block.valuePoint;
        }
      });
  
      if (bestMoveBlock) {
        this.solveTimes++;
        bestMoveBlock.isBestMove = true;
        bestMoveBlock.lockBlockChain(this.solveTimes);
      }
    } while(bestMoveBlock);
  }

  travel(callback) {
    var iterR = this.root;
    var iterB = this.root;

    for (var i=0; i<this.height; i++) {
      var row = [];
      if (i > 0) iterB = iterB.bottom;

      iterR = iterB;
      callback(iterR);
      for (var k=1; k<this.width; k++) {
        iterR = iterR.right;
        callback(iterR);
      }
    }
  }

}
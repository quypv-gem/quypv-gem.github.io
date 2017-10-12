class Matrix {
  constructor(width, height){
    this.root = new Block();
    this.width = width;
    this.height = height;
    
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

}
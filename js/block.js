const spear = 'spear';
const sword = 'sword';
const axe   = 'axe';
const staff = 'staff';
const heart = 'heart';
const bow   = 'bow';
const lock  = 'lock';
const arr_types = [spear, sword, axe, staff, heart, bow];

class Block {
  constructor(ancestor, direction) {
    this.top    = null;
    this.right  = null;
    this.bottom = null;
    this.left   = null;
    this.type   = arr_types[Math.floor(Math.random() * arr_types.length)];
    this.displayType = this.type;
    this.lock   = false;
    this.isRoot = true;
    this.root   = null;
    this.x      = 0;
    this.y      = 0;
    this.highlight  = false;
    this.valuePoint = 0;
    //this.bestMove   = '';
    this.isBestMove = false;
    //this.moveOrder  = 0;
    this.moves = [];

    if (typeof ancestor !== 'undefined') {
      this.root   = ancestor.isRoot ? ancestor : ancestor.root;
      this.isRoot = false;

      switch(direction) {
        case 'right':
          this.x = ancestor.x + 1;
          this.y = ancestor.y;
          this.left = ancestor;
          break;
        case 'bottom':
          this.x = ancestor.x;
          this.y = ancestor.y + 1;
          this.top = ancestor;
          break;
        case 'left':
          this.x = ancestor.x - 1;
          this.y = ancestor.y;
          this.right = ancestor;
          break;
        case 'top':
          this.x = ancestor.x;
          this.y = ancestor.y - 1;
          this.bottom = ancestor;
          break;
      }
    }
  }

  fill(type) {
    this.type = type;
  }

  getWidth() {
    var root = this.getRoot();
  }

  getRoot() {
    if (this.isRoot) return this;
    else return this.root;
  }

  // getUpperRight() {
  //   if (!this.right && !this.top) return this;
  //   if (this.right) return this.right.getUpperRight();
  //   if (this.top) return this.top.getUpperRight();
  // }

  // getBottomRight() {
  //   if (!this.right && !this.bottom) return this;
  //   if (this.right) return this.right.getUpperRight();
  //   if (this.bottom) return this.bottom.getUpperRight();
  // }

  // getBottomLeft() {
  //   if (!this.left && !this.bottom) return this;
  //   if (this.left) return this.left.getUpperRight();
  //   if (this.bottom) return this.bottom.getUpperRight();
  // }

  addRight() {
    this.right = new Block(this, 'right');
    return this.right;
  }
  addBottom() {
    this.bottom = new Block(this, 'bottom');
    var _this = this;

    setTimeout(function(){
      _this.bottom.bindRight();
      _this.bottom.bindLeft();
    });

    return this.bottom;
  }

  pos() {
    return this.x+","+this.y;
  }

  bindRight() {
    if (!this.top) return;
    if (!this.top.right) return;
    if (!this.top.right.bottom) return;

    this.right = this.top.right.bottom;
    this.top.right.bottom.left = this;
  }

  bindLeft() {
    if (!this.top) return;
    if (!this.top.left) return;
    if (!this.top.left.bottom) return;

    this.left = this.top.left.bottom;
    this.top.left.bottom.right = this;
  }

  getTopRight() {
    if (!this.top) return false;
    return this.top.right;
  }
  getTopLeft() {
    if (!this.top) return false;
    return this.top.left;
  }

  _countChain(block, direction, matchType) {
    if (!block[direction] || block[direction].lock || block[direction].type !== matchType) return 0;

    return 1 + this._countChain(block[direction], direction, matchType);
  }

  _countBlockChain(block, matchType, exceptDirection) {
    if (typeof exceptDirection === 'undefined') exceptDirection = '';

    var countLeft   = exceptDirection === 'left'   ? 0 : this._countChain(block, 'left', matchType);
    var countRight  = exceptDirection === 'right'  ? 0 : this._countChain(block, 'right', matchType);
    var countTop    = exceptDirection === 'top'    ? 0 : this._countChain(block, 'top', matchType);
    var countBottom = exceptDirection === 'bottom' ? 0 : this._countChain(block, 'bottom', matchType);

    var countX = countLeft + countRight;
    var countY = countTop + countBottom;
    
    return (countX > 1 && countY > 1) ? countX + countY : Math.max(countX, countY);
  }

  try(direction) {
    if (!this[direction] || this[direction].lock || this[direction].type === this.type) return 0;
    return this._countBlockChain(this[direction], this.type, inverseDirection(direction));
  }

  evaluate() {
    if (this.lock) return;

    var tryRight  = this.try('right');    if (tryRight  > 1) this.bestMove = 'right';
    var tryBottom = this.try('bottom');   if (tryBottom > Math.max(1, tryRight)) this.bestMove = 'bottom';
    var tryTop    = this.try('top');      if (tryTop    > Math.max(1, tryRight, tryBottom)) this.bestMove = 'top';
    var tryLeft   = this.try('left');     if (tryLeft   > Math.max(1, tryRight, tryBottom, tryTop)) this.bestMove = 'left';

    this.valuePoint = Math.max(tryRight, tryBottom, tryTop, tryLeft);

    return this.valuePoint;
  }

  resetEvaluate() {
    this.valuePoint = 0;
    this.bestMove = '';

    // this.isBestMove = 0;
    // this.moves = [];
  }

  _travelChain(block, direction, matchType, callback) {
    if (!block[direction] || block[direction].type !== matchType) return;
    
    callback(block[direction]);
    return this._travelChain(block[direction], direction, matchType, callback);
  }
  lockBlockChain(order) {
    if (!this.isBestMove || !this.bestMove) return false;
    var arrRight = [], arrBottom = [], arrTop = [], arrLeft = [];

    this.moves.push({
      direction: this.bestMove,
      order: order
    });
    this[this.bestMove].lock = 1;

    if (this.bestMove !== 'right') {
      this._travelChain(this[this.bestMove], 'left', this.type, function(block){
        arrLeft.push(block);
      })
    }
    if (this.bestMove !== 'left') {
      this._travelChain(this[this.bestMove], 'right', this.type, function(block){
        arrRight.push(block);
      })
    }
    if (this.bestMove !== 'top') {
      this._travelChain(this[this.bestMove], 'bottom', this.type, function(block){
        arrBottom.push(block);
      })
    }
    if (this.bestMove !== 'bottom') {
      this._travelChain(this[this.bestMove], 'top', this.type, function(block){
        arrTop.push(block);
      })
    }

    if (arrLeft.length + arrRight.length > 1) {
      for (let block of arrLeft) { block.lock = 1 }
      for (let block of arrRight) { block.lock = 1 }
    }

    if (arrTop.length + arrBottom.length > 1) {
      for (let block of arrTop) { block.lock = 1 }
      for (let block of arrBottom) { block.lock = 1 }
    }

    this.swapType(this[this.bestMove]);
  }

  swapType(otherBlock) {
    var tmp = this.type;
    this.type = otherBlock.type;
    otherBlock.type = tmp;
  }

}

//Helper 
function inverseDirection(dir) {
  switch(dir) {
    case 'top': return 'bottom';
    case 'right': return 'left';
    case 'bottom': return 'top';
    case 'left': return 'right'; 
  }
}
const spear = 'spear';
const sword = 'sword';
const axe   = 'axe';
const staff = 'staff';
const heart = 'heart';

class Block {
  constructor(ancestor, direction) {
    this.top    = null;
    this.right  = null;
    this.bottom = null;
    this.left   = null;
    this.type   = '';
    this.lock   = false;
    this.isRoot = true;
    this.root   = null;
    this.x      = 0;
    this.y      = 0;

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

  getUpperRight() {
    if (!this.right && !this.top) return this;
    if (this.right) return this.right.getUpperRight();
    if (this.top) return this.top.getUpperRight();
  }

  getBottomRight() {
    if (!this.right && !this.bottom) return this;
    if (this.right) return this.right.getUpperRight();
    if (this.bottom) return this.bottom.getUpperRight();
  }

  getBottomLeft() {
    if (!this.left && !this.bottom) return this;
    if (this.left) return this.left.getUpperRight();
    if (this.bottom) return this.bottom.getUpperRight();
  }

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

}
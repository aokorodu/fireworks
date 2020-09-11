export class PVector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // magnitude of vector;
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  multiply(num) {
    this.x *= num;
    this.y *= num;
  }

  normalize() {
    const potnuse = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = this.x / potnuse;
    this.y = this.y / potnuse;
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}

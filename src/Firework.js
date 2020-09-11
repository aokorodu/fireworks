import { PVector } from './PVector';
//import * as createjs from 'createjs';
import { TweenMax } from 'gsap';

//const createjs = require('../node_modules/createjs/builds/createjs-2015.11.26.combined');

export class Firework {
  constructor() {
    this.startPosition;
    this.location;
    this.accel;
    this.velocity;
    this.radius = 4;
    this.maxX;
    this.maxY;
    this.lifeSpan;
    this.defaultLifeSpan = 200;
    this.shape;
    this.line;
    this.linePoints = [];
    this.fillColor = '#FFFF00';
    this.drawn = false;
    this.done = false;
    this.lifeSpan = this.defaultLifeSpan;
  }

  initialize(x, y, stage, delay = 0) {
    //console.log(`x:${x}, y:${y}`);
    this.initProps(x, y, delay);
    this.drawShape(stage);
  }

  initProps(x, y, delay) {
    this.startPosition = new PVector(x, y);
    this.location = new PVector(x, y);
    this.accel = new PVector(0, 0.2);

    this.velocity = new PVector(this.xvelocity(), this.yvelocity());

    this.lifeSpan = this.defaultLifeSpan + Math.round(delay);
    this.done = false;
  }
  xvelocity(){
    return Math.random() * 6 - 3;
  }

  yvelocity(){
    return -8 - Math.random() * 4
  }

  drawShape(stage) {
    if (this.drawn) return;
    this.shape = new createjs.Shape();
    this.shape.visible = false;
    this.shape.graphics.beginFill(this.fillColor);
    this.shape.graphics.drawCircle(0, 0, this.radius);
    this.shape.cache(
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2
    );
    stage.addChild(this.shape);

    this.line = new createjs.Shape();
    this.line.alpha = 0.3;
    stage.addChild(this.line);

    this.drawn = true;
  }

  reset() {
    this.lifeSpan = this.defaultLifeSpan;
    this.done = false;
    this.location.x = this.startPosition.x;
    this.location.y = this.startPosition.y;
    this.velocity = new PVector(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    );
  }

  isNew() {
    return this.lifeSpan === this.defaultLifeSpan;
  }

  update() {
    if (this.done) return;
    if (this.lifeSpan < this.defaultLifeSpan) {
      this.shape.visible = true;
      this.line.visible = true;
      this.line.alpha = 0.3;
      this.velocity.add(this.accel);
      this.location.add(this.velocity);
      this.shape.x = this.location.x;
      this.shape.y = this.location.y;
      this.shape.alpha = this.lifeSpan / 100;
      this.linePoints.unshift(new PVector(this.location.x, this.location.y));
      if (this.linePoints.length > 50) this.linePoints.pop();
      const num = this.linePoints.length;
      this.line.graphics.clear();
      this.line.graphics.setStrokeStyle(this.radius);
      this.line.graphics.beginStroke('#FFFFFF');
      this.line.graphics.moveTo(this.linePoints[0].x, this.linePoints[0].y);
      for (let i = 0; i < num; i++) {
        this.line.graphics.lineTo(this.linePoints[i].x, this.linePoints[i].y);
      }
    }

    this.lifeSpan--;
    if (this.lifeSpan <= 0 || this.velocity.y > 2) {
      this.done = true;
      this.shape.visible = false;
      this.linePoints = [];
      TweenMax.to(this.line, 1, { alpha: 0 });
    }
  }
}

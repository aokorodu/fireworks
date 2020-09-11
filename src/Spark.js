import { PVector } from './PVector';
//import * as createjs from '../node_modules/createjs';
//const createjs = require('../node_modules/createjs/builds/createjs-2015.11.26.combined');

export class Spark {
  constructor() {
    this.lifeSpan = 0;
    this.startPosition;
    this.location;
    this.accel;
    this.velocity;
    this.radius;
    this.maxX;
    this.maxY;
    this.lifeSpan;
    this.shape;
    this.line;
    this.linePoints = [];
    this.lineLength = 25;

    this.fillColor = '#FFFFFF';

    this.drawn = false;
  }

  initialize(x, y, maxX, maxY, stage) {
    this.lifeSpan = 200;
    this.startPosition = new PVector(x, y);
    this.location = new PVector(x, y);
    this.accel = new PVector(0, 0.1);

    this.velocity = new PVector(
      Math.random() * 10 - 5,
      Math.random() * 15 - 10
    );

    this.radius = 1 + Math.random() * 5;
    this.maxX = maxX;
    this.maxY = maxY;
    this.lifeSpan = 200;
    this.drawShape(stage);
  }

  drawShape(stage) {
    if (this.drawn) return;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.fillColor);
    this.shape.graphics.drawCircle(0, 0, this.radius);
    this.shape.alpha = 0.5;
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
    this.lifeSpan = 200;
    this.location.x = this.startPosition.x;
    this.location.y = this.startPosition.y;
    this.velocity = new PVector(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    );
  }

  update() {
    if (this.lifeSpan <= 0) return;
    this.velocity.add(this.accel);
    this.location.add(this.velocity);
    this.shape.x = this.location.x;
    this.shape.y = this.location.y;
    this.shape.alpha = (this.lifeSpan / 200) * 0.5;

    this.line.alpha = (this.lifeSpan / 200) * 0.3;
    this.linePoints.unshift(new PVector(this.location.x, this.location.y));
    if (this.linePoints.length > this.lineLength) this.linePoints.pop();
    const num = this.linePoints.length;
    this.line.graphics.clear();
    this.line.graphics.setStrokeStyle(1);
    this.line.graphics.beginStroke('#FFFFFF');
    this.line.graphics.moveTo(this.linePoints[0].x, this.linePoints[0].y);
    for (let i = 0; i < num; i++) {
      this.line.graphics.lineTo(this.linePoints[i].x, this.linePoints[i].y);
    }
    this.lifeSpan--;
    if (this.lifeSpan <= 0) {
      this.linePoints = [];
    }
  }

  isDone() {
    return this.lifeSpan <= 0;
  }
}

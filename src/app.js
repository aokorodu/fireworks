import "./style.scss";
import { Spark } from './Spark';
import { Firework } from './Firework';
//import * as createjs from 'createjs';
//const createjs = require('../node_modules/createjs/builds/createjs-2015.11.26.combined');

export class App {
  constructor() {
    this.sparks = [];
    this.totalSparks = 250;
    this.maxSparksInExplosion = 33;
    this.wizzSoundFrequency = 0.33;
    this.fireworks = [];
    this.totalFireworks = 5;
    this.fwOriginY
    this.active = true;
    this.stage = null;
    this.svgWidth = 600;
    this.svgHeight = 600;
  }

  init(){
    console.log('init App')
    this.initCreateJS();
    this.initStage();
    this.buildSparks();
    this.updateParticles();
    setTimeout(this.buildFireworks.bind(this), 1000);
  }

  initCreateJS() {
    // hack so that the createjs loader will work.  See https://stackoverflow.com/questions/44828676/preloadjs-not-working-on-angular-createjs-module
    window.createjs = createjs;
  }


  ionViewWillEnter() {
    this.mixpanelService.setTrackPage('Kid boss reflect 6').subscribe();
  }

  initStage() {
    this.stage = new createjs.Stage('firework-canvas');
  }

  buildSparks() {
    this.sparkHolder = document.getElementById('spark-holder');
    for (let i = 0; i < this.totalSparks; i++) {
      const spark = new Spark();
      this.sparks.push(spark);
    }
  }

  buildFireworks() {
    const holder = document.getElementById('trophy-holder');
    const rect = holder.getBoundingClientRect();
    this.fwOriginY = 370;
    for (let i = 0; i < this.totalFireworks; i++) {
      const fw = new Firework();
      const delay = i * 60;
      fw.initialize(this.svgWidth / 2, this.fwOriginY, this.stage, delay);
      this.fireworks.push(fw);
    }
  }

  updateParticles() {
    if (!this.active) return;

    for (const spark of this.sparks) {
        spark.update();
    }

    for (const fw of this.fireworks) {
      if (fw.isNew()) {
        //this.soundEffects.playSound('firework_launch_start', 0.05);
      }
      fw.update();
      if (fw.done) {
        this.triggerFireworks(fw.location.x, fw.location.y);
        fw.initialize(
          this.svgWidth / 2,
          this.fwOriginY,
          this.stage,
          120 + Math.random() * 120
        );
      }
    }
    this.stage.update();

    window.requestAnimationFrame(this.updateParticles.bind(this));
  }

  triggerFireworks(xPos, yPos) {
        //this.soundEffects.playSound('firework_pop', 0.1);
    if (Math.random() < this.wizzSoundFrequency) {
        //this.soundEffects.playSound('wizz', 0.1);
    }
    const availableSparks = this.sparks.filter(spark => {
      return spark.isDone();
    });
    const num =
      availableSparks.length < this.maxSparksInExplosion
        ? availableSparks.length
        : this.maxSparksInExplosion;
    for (let i = 0; i < num;  i++){
      const spark = availableSparks[i];
      spark.initialize(xPos, yPos, this.svgWidth, this.svgHeight, this.stage);
    }
  }

  next() {
        this.challengesNavService.childChallenges();
  }

  ngOnDestroy() {
        this.destroy();
  }

  destroy() {
        this.active = false;
    createjs.Ticker.reset();
    if (this.stage) {
        this.stage.removeAllChildren();
    }
  }
}

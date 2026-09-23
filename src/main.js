import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import PrologueScene from './scenes/PrologueScene.js';
import Chapter1Scene from './scenes/Chapter1Scene.js';
import Chapter2Scene from './scenes/Chapter2Scene.js';
import Chapter3Scene from './scenes/Chapter3Scene.js';
import Chapter4Scene from './scenes/Chapter4Scene.js';
import Chapter5Scene from './scenes/Chapter5Scene.js';
import Chapter6Scene from './scenes/Chapter6Scene.js';
import EndOfPrototypeScene from './scenes/EndOfPrototypeScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#120c14',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 405,
    height: 720,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    TitleScene,
    PrologueScene,
    Chapter1Scene,
    Chapter2Scene,
    Chapter3Scene,
    Chapter4Scene,
    Chapter5Scene,
    Chapter6Scene,
    EndOfPrototypeScene,
  ],
};

new Phaser.Game(config);

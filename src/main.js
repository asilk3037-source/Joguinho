import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import Chapter3Scene from './scenes/Chapter3Scene.js';

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
  scene: [BootScene, TitleScene, Chapter3Scene],
};

new Phaser.Game(config);

import Phaser from 'phaser';
import DialogueChapterScene from './DialogueChapterScene.js';
import { chapter4Steps } from '../data/chapter4Dialogue.js';

export default class Chapter4Scene extends DialogueChapterScene {
  constructor() {
    super('Chapter4');
  }

  getBackgroundColor() {
    return '#2a1f2e';
  }

  getCardInfo() {
    return { kicker: 'Capítulo 4', title: 'Gatinha do zoi verde', date: 'os nomes' };
  }

  getSteps() {
    return chapter4Steps;
  }

  getNextSceneKey() {
    return 'Chapter5';
  }

  onBackgroundCreate() {
    const { width, height } = this.scale;
    this.add.sprite(width * 0.3, height * 0.24, 'line_sheet', 0).setScale(1.5);
    this.add.sprite(width * 0.7, height * 0.24, 'bell_sheet', 0).setScale(1.5);

    this.heartTimer = this.time.addEvent({
      delay: 450,
      loop: true,
      callback: () => this.spawnHeart(),
    });
  }

  spawnHeart() {
    const { width, height } = this.scale;
    const x = Phaser.Math.Between(width * 0.15, width * 0.85);
    const heart = this.add.image(x, height * 0.32, 'heart').setScale(Phaser.Math.FloatBetween(0.5, 0.9)).setAlpha(0.85);
    this.tweens.add({
      targets: heart,
      y: heart.y - 90,
      alpha: 0,
      duration: 1600,
      ease: 'Sine.easeOut',
      onComplete: () => heart.destroy(),
    });
  }

  onChapterEnd() {
    if (this.heartTimer) this.heartTimer.remove();
    super.onChapterEnd();
  }
}

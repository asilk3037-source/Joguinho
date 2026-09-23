import Phaser from 'phaser';
import DialogueChapterScene from './DialogueChapterScene.js';
import { chapter2Steps } from '../data/chapter2Dialogue.js';

export default class Chapter2Scene extends DialogueChapterScene {
  constructor() {
    super('Chapter2');
  }

  getBackgroundColor() {
    return '#161c16';
  }

  getCardInfo() {
    return { kicker: 'Capítulo 2', title: 'Galo × Cruzeiro', date: 'o único defeito' };
  }

  getSteps() {
    return chapter2Steps;
  }

  getNextSceneKey() {
    return 'Chapter3';
  }

  onBackgroundCreate() {
    const { width } = this.scale;
    this.jersey = this.add.image(width / 2, 170, 'bell_cruzeiro').setScale(1.6);
  }

  onStepRendered(index, step) {
    if (step && step.beat === 'galoReveal') {
      this.revealGalo();
    }
  }

  revealGalo() {
    this.tweens.add({
      targets: this.jersey,
      scale: 0,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.jersey.setTexture('bell_galo');
        this.tweens.add({ targets: this.jersey, scale: 1.6, duration: 260, ease: 'Back.easeOut' });
      },
    });

    for (let i = 0; i < 10; i += 1) {
      const heart = this.add.image(this.jersey.x, this.jersey.y, 'heart').setScale(0.6).setAlpha(0.9);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(60, 140);
      this.tweens.add({
        targets: heart,
        x: this.jersey.x + Math.cos(angle) * dist,
        y: this.jersey.y + Math.sin(angle) * dist - 30,
        alpha: 0,
        scale: 1.1,
        duration: 700,
        delay: 150,
        ease: 'Cubic.easeOut',
        onComplete: () => heart.destroy(),
      });
    }
  }
}

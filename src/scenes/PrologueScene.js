import Phaser from 'phaser';
import DialogueChapterScene from './DialogueChapterScene.js';
import { idleFrame } from '../ui/spriteAnim.js';

const prologueSteps = [
  { speaker: 'narrator', text: 'O Happn mostra quem cruza o seu caminho.' },
  { speaker: 'narrator', text: 'A gente fazia o mesmo trajeto pela cidade e se cruzava várias vezes, sem saber.' },
  { speaker: 'narrator', text: '1º de maio de 2024. A cidade cansou de deixar por acaso.' },
  { speaker: 'bell', text: '"oiii bom diaaaa"' },
];

export default class PrologueScene extends DialogueChapterScene {
  constructor() {
    super('Prologue');
  }

  getBackgroundColor() {
    return '#211b33';
  }

  getCardInfo() {
    return { kicker: 'Prólogo', title: 'O Cruzamento', date: '01 · 05 · 2024 · onde tudo cruzou' };
  }

  getSteps() {
    return prologueSteps;
  }

  getNextSceneKey() {
    return 'Chapter1';
  }

  onBackgroundCreate() {
    const { width, height } = this.scale;
    const laneY1 = height * 0.32;
    const laneY2 = height * 0.4;

    this.line = this.add
      .sprite(-30, laneY1, 'line_walk4', idleFrame('right'))
      .setScale(0.7)
      .setAlpha(0.55)
      .setTint(0x171225);
    this.bellSil = this.add
      .sprite(width + 30, laneY2, 'bell_walk4', idleFrame('left'))
      .setScale(0.7)
      .setAlpha(0.55)
      .setTint(0x171225);
    this.line.play('line_walk_right');
    this.bellSil.play('bell_walk_left');

    this.tweens.add({
      targets: this.line,
      x: width + 30,
      duration: 6500,
      repeat: -1,
      onRepeat: () => {
        this.line.x = -30;
      },
    });
    this.tweens.add({
      targets: this.bellSil,
      x: -30,
      duration: 7200,
      repeat: -1,
      onRepeat: () => {
        this.bellSil.x = width + 30;
      },
    });

    for (let i = 0; i < 18; i += 1) {
      const star = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height * 0.6), 'star');
      this.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 0.9 },
        duration: Phaser.Math.Between(900, 2200),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500),
      });
    }
  }
}

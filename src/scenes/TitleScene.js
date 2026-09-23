import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#1c1420');

    this.add
      .text(width / 2, height * 0.28, 'Bell', {
        fontFamily: 'Georgia, serif',
        fontSize: '56px',
        color: '#e8c07d',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.36, '&', {
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        color: '#d98a8a',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.44, 'Line', {
        fontFamily: 'Georgia, serif',
        fontSize: '56px',
        color: '#e8c07d',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.53, 'a nossa história', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#c9b8c4',
      })
      .setOrigin(0.5);

    const heart = this.add.image(width / 2, height * 0.68, 'heart').setScale(1.4);
    this.tweens.add({
      targets: heart,
      scale: { from: 1.2, to: 1.6 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const startLabel = this.add
      .text(width / 2, height * 0.82, 'toque para começar', {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        color: '#f4ece2',
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: startLabel,
      alpha: { from: 1, to: 0.35 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.add
      .text(width / 2, height * 0.94, 'protótipo · arte em produção', {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#6d5f6b',
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('Prologue');
    });
  }
}

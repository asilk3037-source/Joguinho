import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#1f1827');

    // Soft warm glow behind the title, approximating the reference's
    // radial gradient (circle at 50% 15%, #745071 -> #38263f -> #1f1827).
    const glow = this.add.graphics();
    const glowX = width / 2;
    const glowY = height * 0.24;
    const rings = [
      [340, 0x38263f, 0.5],
      [260, 0x513d63, 0.55],
      [180, 0x745071, 0.6],
    ];
    rings.forEach(([r, color, alpha]) => {
      glow.fillStyle(color, alpha);
      glow.fillCircle(glowX, glowY, r);
    });

    this.add
      .text(width / 2, height * 0.26, 'Bell', {
        fontFamily: 'Georgia, serif',
        fontSize: '58px',
        color: '#fff5ea',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.345, '&', {
        fontFamily: 'Georgia, serif',
        fontSize: '30px',
        color: '#f29aa5',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.43, 'Line', {
        fontFamily: 'Georgia, serif',
        fontSize: '58px',
        color: '#fff5ea',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.53, 'UMA HISTÓRIA QUE CRUZOU CAMINHOS', {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#f7d9c9',
      })
      .setOrigin(0.5);

    const heart = this.add.image(width / 2, height * 0.65, 'heart').setScale(1.3);
    this.tweens.add({
      targets: heart,
      scale: { from: 1.15, to: 1.45 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // "Sticker" pill button with a hard drop-shadow edge, like the rest of
    // the UI (dialogue box, HUD chips). Graphics draws the rounded look;
    // a separate invisible rectangle on top handles the tap (Graphics
    // objects don't hit-test against their drawn shape by default).
    const btnY = height * 0.78;
    const btnW = 250;
    const btnH = 54;
    const btnGraphics = this.add.graphics();
    const drawButton = (offsetY) => {
      btnGraphics.clear();
      btnGraphics.fillStyle(0x9d485e, 1);
      btnGraphics.fillRoundedRect(width / 2 - btnW / 2, btnY - btnH / 2 + 5, btnW, btnH, 15);
      btnGraphics.fillStyle(0xed7c8d, 1);
      btnGraphics.fillRoundedRect(width / 2 - btnW / 2, btnY - btnH / 2 + offsetY, btnW, btnH, 15);
    };
    drawButton(0);
    const btnLabel = this.add
      .text(width / 2, btnY, 'Começar nossa história', {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: '800',
      })
      .setOrigin(0.5);
    const btnHit = this.add
      .rectangle(width / 2, btnY, btnW, btnH, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    btnHit.on('pointerdown', () => {
      drawButton(3);
      btnLabel.y = btnY + 3;
    });
    const release = () => {
      drawButton(0);
      btnLabel.y = btnY;
    };
    btnHit.on('pointerup', () => {
      release();
      this.scene.start('Prologue');
    });
    btnHit.on('pointerout', release);

    this.add
      .text(width / 2, height * 0.94, 'protótipo · arte em produção', {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#8a7690',
      })
      .setOrigin(0.5);
  }
}

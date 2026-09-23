import Phaser from 'phaser';

const SPEAKER_META = {
  line: { name: 'Line', color: 0x2b2b3d, letter: 'L' },
  bell: { name: 'Bell', color: 0xd98a8a, letter: 'B' },
  narrator: { name: '', color: 0x4a3f47, letter: '' },
};

// Bottom dialogue box: speaker portrait + name + text, advanced by tapping
// the action button. Steps of type "choice" pause and wait for one of the
// option buttons instead.
//
// Deliberately NOT using a Phaser Container: interactive children of a
// scrollFactor(0) container don't hit-test correctly once the camera has
// scrolled (their input hit area isn't corrected for the container's
// scrollFactor), so taps land on the wrong world position. Every piece is
// added straight to the scene with its own setScrollFactor(0) instead.
export default class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = scene.scale;
    const depth = 900;
    const boxHeight = 150;
    const boxY = height - boxHeight;

    const bg = scene.add.graphics().setScrollFactor(0).setDepth(depth);
    bg.fillStyle(0x1c1420, 0.94);
    bg.fillRoundedRect(10, boxY, width - 20, boxHeight - 10, 10);
    bg.lineStyle(2, 0xe8c07d, 0.8);
    bg.strokeRoundedRect(10, boxY, width - 20, boxHeight - 10, 10);
    this.bg = bg;

    this.portrait = scene.add
      .circle(46, boxY + 34, 22, 0x2b2b3d)
      .setScrollFactor(0)
      .setDepth(depth);
    this.portraitLetter = scene.add
      .text(46, boxY + 34, '', { fontFamily: 'sans-serif', fontSize: '20px', color: '#ffffff' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(depth);
    this.nameText = scene.add
      .text(78, boxY + 16, '', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#e8c07d',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(depth);
    this.bodyText = scene.add
      .text(78, boxY + 36, '', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#f4ece2',
        wordWrap: { width: width - 100 },
        lineSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(depth);
    this.hintText = scene.add
      .text(width - 24, height - 22, 'toque A', {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#8a7b86',
      })
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(depth);

    this.pieces = [this.bg, this.portrait, this.portraitLetter, this.nameText, this.bodyText, this.hintText];
    this.setPiecesVisible(false);

    this.choiceButtons = [];
    this.boxY = boxY;

    this.steps = [];
    this.index = -1;
    this.active = false;
    this.waitingForChoice = false;
    this.onCompleteCallback = null;
  }

  setPiecesVisible(visible) {
    this.pieces.forEach((p) => p.setVisible(visible));
  }

  open(steps, onComplete) {
    this.steps = steps;
    this.index = -1;
    this.active = true;
    this.onCompleteCallback = onComplete || null;
    this.setPiecesVisible(true);
    this.advance();
  }

  isActive() {
    return this.active;
  }

  advance() {
    if (this.waitingForChoice) return;
    this.index += 1;
    if (this.index >= this.steps.length) {
      this.close();
      return;
    }
    this.renderStep(this.steps[this.index]);
  }

  renderStep(step) {
    this.clearChoices();

    if (step.type === 'choice') {
      const meta = SPEAKER_META.narrator;
      this.applySpeaker(meta);
      this.bodyText.setText(step.text);
      this.hintText.setText('');
      this.showChoices(step.options);
      return;
    }

    const meta = SPEAKER_META[step.speaker] || SPEAKER_META.narrator;
    this.applySpeaker(meta);
    this.bodyText.setText(step.text);
    this.hintText.setText('toque A');
  }

  applySpeaker(meta) {
    this.portrait.setFillStyle(meta.color);
    this.portraitLetter.setText(meta.letter);
    this.nameText.setText(meta.name);
  }

  showChoices(options) {
    this.waitingForChoice = true;
    const startX = 78;
    const gapY = 22;

    options.forEach((opt, i) => {
      const y = this.boxY + 68 + i * gapY;
      const label = this.scene.add
        .text(startX, y, `▸ ${opt.label}`, {
          fontFamily: 'sans-serif',
          fontSize: '13px',
          color: '#e8c07d',
        })
        .setScrollFactor(0)
        .setDepth(901)
        .setInteractive({ useHandCursor: true });

      label.on('pointerdown', () => this.resolveChoice(opt));
      this.choiceButtons.push(label);
    });
  }

  resolveChoice(option) {
    this.clearChoices();
    this.waitingForChoice = false;
    const meta = SPEAKER_META.bell;
    this.applySpeaker(meta);
    this.bodyText.setText(option.reply);
    this.hintText.setText('toque A');
  }

  clearChoices() {
    this.choiceButtons.forEach((b) => b.destroy());
    this.choiceButtons = [];
  }

  close() {
    this.active = false;
    this.setPiecesVisible(false);
    this.clearChoices();
    if (this.onCompleteCallback) this.onCompleteCallback();
  }
}

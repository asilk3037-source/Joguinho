import Phaser from 'phaser';

const PALETTE = {
  cream: 0xfff8ed,
  border: 0x6f4b67,
  shadow: 0x38263f,
  speaker: 0xb44f69,
  text: 0x3a2940,
};

const SPEAKER_META = {
  line: { name: 'Line', portraitTexture: 'line_portraits' },
  bell: { name: 'Bell', portraitTexture: 'bell_portraits' },
  narrator: { name: '', portraitTexture: null },
};

// Frame order in both line_portraits.png and bell_portraits.png (same 3x2
// grid layout — see BootScene.js preload comment).
const EXPRESSION_FRAMES = { neutral: 0, smile: 1, laugh: 2, surprised: 3, blush: 4, nervous: 5 };

// Bottom dialogue box: speaker portrait + name + text, advanced by tapping
// the action button. Steps of type "choice" pause and wait for one of the
// option buttons instead. Cream/plum "sticker" look matching the
// reference mockup, with a hard drop-shadow behind the box and a bobbing
// "A ›" next indicator.
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
    const boxHeight = 158;
    const boxY = height - boxHeight;
    this.boxY = boxY;
    this.boxHeight = boxHeight;

    const bg = scene.add.graphics().setScrollFactor(0).setDepth(depth);
    bg.fillStyle(PALETTE.shadow, 1);
    bg.fillRoundedRect(10, boxY + 6, width - 20, boxHeight - 10, 16);
    bg.fillStyle(PALETTE.cream, 1);
    bg.fillRoundedRect(10, boxY, width - 20, boxHeight - 10, 16);
    bg.lineStyle(4, PALETTE.border, 1);
    bg.strokeRoundedRect(10, boxY, width - 20, boxHeight - 10, 16);
    this.bg = bg;

    const portraitX = 64;
    const portraitY = boxY + boxHeight - 62;
    this.portrait = scene.add
      .circle(portraitX, portraitY, 46, 0xffffff)
      .setStrokeStyle(3, PALETTE.border)
      .setScrollFactor(0)
      .setDepth(depth);
    this.portraitImage = scene.add
      .image(portraitX, portraitY, 'line_portraits', 0)
      .setDisplaySize(80, 80)
      .setScrollFactor(0)
      .setDepth(depth + 1)
      .setVisible(false);
    this.nameText = scene.add
      .text(128, boxY + 18, '', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#b44f69',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.bodyText = scene.add
      .text(128, boxY + 40, '', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#3a2940',
        wordWrap: { width: width - 150 },
        lineSpacing: 5,
      })
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.hintText = scene.add
      .text(width - 26, height - 24, 'A ›', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#b44f69',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.hintBaseY = this.hintText.y;
    scene.tweens.add({
      targets: this.hintText,
      y: this.hintBaseY + 4,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.pieces = [this.bg, this.portrait, this.portraitImage, this.nameText, this.bodyText, this.hintText];
    this.setPiecesVisible(false);

    this.choiceButtons = [];

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
      this.hintText.setVisible(false);
      this.showChoices(step.options);
      return;
    }

    const meta = SPEAKER_META[step.speaker] || SPEAKER_META.narrator;
    this.applySpeaker(meta, step.expression);
    this.bodyText.setText(step.text);
    this.hintText.setVisible(true);
  }

  applySpeaker(meta, expression) {
    this.nameText.setText(meta.name);

    if (meta.portraitTexture) {
      const frame = EXPRESSION_FRAMES[expression] ?? EXPRESSION_FRAMES.neutral;
      this.portraitImage.setTexture(meta.portraitTexture, frame).setVisible(true);
      this.portrait.setVisible(true);
    } else {
      this.portraitImage.setVisible(false);
      this.portrait.setVisible(false);
    }
  }

  showChoices(options) {
    this.waitingForChoice = true;
    const startX = 128;
    const gapY = 24;

    options.forEach((opt, i) => {
      const y = this.boxY + 70 + i * gapY;
      const label = this.scene.add
        .text(startX, y, `▸ ${opt.label}`, {
          fontFamily: 'sans-serif',
          fontSize: '14px',
          color: '#b44f69',
          fontStyle: 'bold',
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
    const meta = SPEAKER_META[option.speaker || 'bell'];
    this.applySpeaker(meta, option.expression);
    this.bodyText.setText(option.reply);
    this.hintText.setVisible(true);
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

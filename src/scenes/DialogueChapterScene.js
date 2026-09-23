import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';

// Base class for chapters that are pure dialogue/cutscene — no player
// movement, just a chapter card, a linear (optionally branching) script,
// and a transition to the next scene. Chapter3Scene (exploration) doesn't
// use this; Prologue/Chapter1/Chapter2/Chapter4 do.
//
// Subclasses implement getCardInfo(), getSteps() and getNextSceneKey().
// Override onBackgroundCreate() to draw scenery behind the dialogue box,
// and onStepRendered(index, step) for one-off beats (e.g. a jersey swap).
export default class DialogueChapterScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor(this.getBackgroundColor());
    this.ended = false;

    this.onBackgroundCreate();

    this.controls = new TouchControls(this, { showMovement: false });
    this.dialogue = new DialogueBox(this);

    const card = this.getCardInfo();
    this.showChapterCard(card.kicker, card.title, card.date, () => {
      this.dialogue.open(this.getSteps(), () => this.onChapterEnd());
    });
  }

  getBackgroundColor() {
    return '#1c1420';
  }

  onBackgroundCreate() {}

  onChapterEnd() {
    this.ended = true;
    this.scene.start(this.getNextSceneKey());
  }

  update() {
    if (this.ended) return;
    const input = this.controls.poll();
    if (this.dialogue.isActive() && input.action) {
      const beforeIndex = this.dialogue.index;
      this.dialogue.advance();
      if (this.dialogue.index !== beforeIndex && this.dialogue.index >= 0) {
        this.onStepRendered(this.dialogue.index, this.dialogue.steps[this.dialogue.index]);
      }
    }
  }

  onStepRendered() {}

  showChapterCard(kicker, title, date, onDone) {
    const { width, height } = this.scale;
    const depth = 2000;
    const pieces = [
      this.add.rectangle(width / 2, height / 2, width, height, 0x120c14, 1),
      this.add
        .text(width / 2, height * 0.42, kicker, { fontFamily: 'sans-serif', fontSize: '13px', color: '#d98a8a' })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.48, title, { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#e8c07d' })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.55, date, { fontFamily: 'sans-serif', fontSize: '12px', color: '#c9b8c4' })
        .setOrigin(0.5),
    ];
    pieces.forEach((p) => p.setScrollFactor(0).setDepth(depth));

    this.controls.setVisible(false);
    this.tweens.add({
      targets: pieces,
      alpha: { from: 1, to: 0 },
      delay: 1300,
      duration: 500,
      onComplete: () => {
        pieces.forEach((p) => p.destroy());
        this.controls.setVisible(true);
        if (onDone) onDone();
      },
    });
  }
}

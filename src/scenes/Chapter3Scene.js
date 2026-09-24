import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import ChipHud from '../ui/ChipHud.js';
import { faceFromVector, applyWalkAnim, ySortDepth } from '../ui/spriteAnim.js';
import { chapter3Steps } from '../data/chapter3Dialogue.js';

const WORLD_W = 720;
const WORLD_H = 1280;
const PLAYER_SPEED = 150;
const INTERACT_RANGE = 60;
const TABLE_X = 360;
const TABLE_Y = 700;

export default class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super('Chapter3');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.image(0, 0, 'mall_bg').setOrigin(0, 0);

    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H - 90, 'line_walk4', 0);
    this.player.setSize(28, 18).setOffset(22, 48);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'down';

    this.bell = this.physics.add.staticSprite(TABLE_X, TABLE_Y - 60, 'bell_walk4', 0);
    this.bell.setDepth(this.bell.y);

    this.eatSprite = this.add
      .sprite(TABLE_X, TABLE_Y, 'eat36', 0)
      .setDisplaySize(300, 300)
      .setVisible(false)
      .setDepth(TABLE_Y + 1);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.controls = new TouchControls(this);
    this.dialogue = new DialogueBox(this);
    this.hud = new ChipHud(this, 'Minas Shopping', '♥ 09/05/2024');

    this.interactHint = this.add
      .text(this.bell.x, this.bell.y - 46, 'toque A para falar com a Bell', {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#1c1420',
        backgroundColor: '#f4ece2',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.chapterEnded = false;

    this.showChapterCard('Capítulo 3', 'No Minas Shopping', '09 · 05 · 2024 · o primeiro encontro');
  }

  showChapterCard(kicker, title, date) {
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
      },
    });
  }

  update() {
    if (this.chapterEnded) return;

    const input = this.controls.poll();
    const distToBell = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bell.x, this.bell.y);
    const nearBell = distToBell <= INTERACT_RANGE;

    if (this.dialogue.isActive()) {
      this.player.setVelocity(0, 0);
      this.interactHint.setVisible(false);
      if (input.action) this.dialogue.advance();
      if (!this.dialogue.isActive()) {
        this.controls.setMovementEnabled(true);
        this.onDialogueComplete();
      }
      return;
    }

    this.interactHint.setVisible(nearBell);

    if (input.action && nearBell) {
      this.controls.setMovementEnabled(false);
      this.startEatingScene();
      this.dialogue.open(chapter3Steps);
      return;
    }

    this.handleMovement(input);
  }

  handleMovement(input) {
    let vx = 0;
    let vy = 0;
    if (input.left) vx -= 1;
    if (input.right) vx += 1;
    if (input.up) vy -= 1;
    if (input.down) vy += 1;

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * PLAYER_SPEED;
      vy = (vy / len) * PLAYER_SPEED;
      this.player.facing = faceFromVector(vx, vy, this.player.facing);
    }
    applyWalkAnim(this.player, 'line', this.player.facing, moving);
    ySortDepth(this.player);

    this.player.setVelocity(vx, vy);
  }

  // They sit down and eat together for the rest of the conversation — a
  // nod to the "BK" joke and the real food-court setting.
  startEatingScene() {
    this.player.setVisible(false);
    this.bell.setVisible(false);
    this.eatSprite.setVisible(true).play('eat_loop');
  }

  onDialogueComplete() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.scene.start('Chapter4');
  }
}

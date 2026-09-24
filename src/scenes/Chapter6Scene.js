import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import ChipHud from '../ui/ChipHud.js';
import { faceFromVector, applyWalkAnim, ySortDepth } from '../ui/spriteAnim.js';
import { chapter6Steps } from '../data/chapter6Dialogue.js';

const WORLD_W = 720;
const WORLD_H = 1280;
const PLAYER_SPEED = 150;
const INTERACT_RANGE = 60;
const MEET_X = 360;
const MEET_Y = 420;

export default class Chapter6Scene extends Phaser.Scene {
  constructor() {
    super('Chapter6');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.image(0, 0, 'tunnel_bg').setOrigin(0, 0);

    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H - 90, 'line_walk4', 0);
    this.player.setSize(28, 18).setOffset(22, 48);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'up';

    this.bell = this.physics.add.staticSprite(MEET_X, MEET_Y, 'bell_walk4', 0);
    this.bell.setDepth(this.bell.y);

    this.kissSprite = this.add
      .sprite(MEET_X, MEET_Y - 20, 'kiss8', 0)
      .setDisplaySize(260, 346)
      .setVisible(false)
      .setDepth(MEET_Y + 1);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.controls = new TouchControls(this);
    this.dialogue = new DialogueBox(this);
    this.hud = new ChipHud(this, 'Sapucaí', '♥ 19/05/2024');

    this.interactHint = this.add
      .text(this.bell.x, this.bell.y - 46, 'toque A pra chegar perto da Bell', {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#1c1420',
        backgroundColor: '#f4ece2',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.chapterEnded = false;

    this.showChapterCard();
  }

  showChapterCard() {
    const { width, height } = this.scale;
    const depth = 2000;
    const pieces = [
      this.add.rectangle(width / 2, height / 2, width, height, 0x120c14, 1),
      this.add
        .text(width / 2, height * 0.42, 'Capítulo 6', { fontFamily: 'sans-serif', fontSize: '13px', color: '#d98a8a' })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.48, 'Sapucaí', { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#e8c07d' })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.55, '19 · 05 · 2024 · e a noite terminou', {
          fontFamily: 'sans-serif',
          fontSize: '12px',
          color: '#c9b8c4',
        })
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
        this.playKissAndFinish();
      }
      return;
    }

    this.interactHint.setVisible(nearBell);

    if (input.action && nearBell) {
      this.controls.setMovementEnabled(false);
      this.dialogue.open(chapter6Steps);
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

  // The romantic capstone of "day one": the embrace plays once, then we
  // hold on the last frame for a beat before moving on.
  playKissAndFinish() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.controls.setVisible(false);
    this.player.setVisible(false);
    this.bell.setVisible(false);
    this.kissSprite.setVisible(true).play('kiss_play');
    this.kissSprite.once('animationcomplete', () => {
      this.time.delayedCall(1200, () => this.scene.start('EndOfPrototype'));
    });
  }
}

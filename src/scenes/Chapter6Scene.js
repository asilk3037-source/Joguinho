import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import { faceFromVector, applyWalkAnim, ySortDepth } from '../ui/spriteAnim.js';
import { chapter6Steps } from '../data/chapter6Dialogue.js';

const WORLD_W = 500;
const WORLD_H = 800;
const PLAYER_SPEED = 150;
const INTERACT_RANGE = 46;

export default class Chapter6Scene extends Phaser.Scene {
  constructor() {
    super('Chapter6');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1c1a33');
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'floor_tile_night').setOrigin(0, 0);

    for (let i = 0; i < 40; i += 1) {
      const star = this.add.image(
        Phaser.Math.Between(0, WORLD_W),
        Phaser.Math.Between(0, WORLD_H * 0.55),
        'star',
      );
      this.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 0.9 },
        duration: Phaser.Math.Between(900, 2200),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500),
      });
    }

    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H - 90, 'line_sheet', 0);
    this.player.setSize(24, 16).setOffset(20, 44);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'up';

    this.bell = this.physics.add.staticSprite(WORLD_W / 2, 190, 'bell_sheet', 0);
    this.bell.setDepth(this.bell.y);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.controls = new TouchControls(this);
    this.dialogue = new DialogueBox(this);

    this.interactHint = this.add
      .text(this.bell.x, this.bell.y - 40, 'toque A pra chegar perto da Bell', {
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
        this.finishChapter();
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

  finishChapter() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.scene.start('EndOfPrototype');
  }
}

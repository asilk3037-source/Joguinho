import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import { faceFromVector, applyWalkAnim, ySortDepth } from '../ui/spriteAnim.js';
import { chapter5Landmarks } from '../data/chapter5Landmarks.js';
import ChipHud from '../ui/ChipHud.js';

const WORLD_W = 900;
const WORLD_H = 1400;
const PLAYER_SPEED = 160;
const COLLECT_RANGE = 42;
const COMPANION_OFFSET = 30;

export default class Chapter5Scene extends Phaser.Scene {
  constructor() {
    super('Chapter5');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f1e6c8');
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'floor_tile').setOrigin(0, 0);

    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H - 80, 'line_walk4', 0);
    this.player.setSize(28, 18).setOffset(22, 48);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'down';

    this.companion = this.add.sprite(this.player.x, this.player.y + COMPANION_OFFSET, 'bell_walk4', 0);
    this.companion.facing = 'down';

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.controls = new TouchControls(this);
    this.dialogue = new DialogueBox(this);

    this.markers = chapter5Landmarks.map((spot) => {
      const marker = this.add.image(spot.x, spot.y, 'landmark');
      const label = this.add
        .text(spot.x, spot.y - 20, spot.name, {
          fontFamily: 'sans-serif',
          fontSize: '11px',
          color: '#1c1420',
          backgroundColor: '#f4ece2',
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5);
      this.tweens.add({
        targets: marker,
        scale: { from: 1, to: 1.15 },
        duration: 650,
        yoyo: true,
        repeat: -1,
      });
      return { ...spot, marker, label, collected: false };
    });

    this.hud = new ChipHud(this, 'Belo Horizonte', '19/05/2024');

    this.collectedCount = 0;
    this.progressText = this.add
      .text(16, 54, `0/${this.markers.length} lugares`, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#1c1420',
        backgroundColor: '#f4ece2',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(500);

    this.toastText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.16, '', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#f4ece2',
        backgroundColor: '#1c1420cc',
        padding: { x: 10, y: 6 },
        wordWrap: { width: this.scale.width - 60 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(500)
      .setAlpha(0);

    this.navArrow = this.add.image(this.player.x, this.player.y, 'nav_arrow').setDepth(9999);

    this.chapterEnded = false;

    this.showChapterCard();
  }

  showChapterCard() {
    const { width, height } = this.scale;
    const depth = 2000;
    const pieces = [
      this.add.rectangle(width / 2, height / 2, width, height, 0x120c14, 1),
      this.add
        .text(width / 2, height * 0.4, 'Capítulo 5', { fontFamily: 'sans-serif', fontSize: '13px', color: '#d98a8a' })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.46, 'A cidade toda, a pé', {
          fontFamily: 'Georgia, serif',
          fontSize: '26px',
          color: '#e8c07d',
        })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.53, '19 · 05 · 2024 · o primeiro rolezão', {
          fontFamily: 'sans-serif',
          fontSize: '12px',
          color: '#c9b8c4',
        })
        .setOrigin(0.5),
      this.add
        .text(width / 2, height * 0.6, 'ande até os pontos no mapa', {
          fontFamily: 'sans-serif',
          fontSize: '11px',
          color: '#8a7b86',
        })
        .setOrigin(0.5),
    ];
    pieces.forEach((p) => p.setScrollFactor(0).setDepth(depth));

    this.controls.setVisible(false);
    this.tweens.add({
      targets: pieces,
      alpha: { from: 1, to: 0 },
      delay: 1500,
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

    if (this.dialogue.isActive()) {
      this.player.setVelocity(0, 0);
      if (input.action) this.dialogue.advance();
      if (!this.dialogue.isActive()) this.finishChapter();
      return;
    }

    this.handleMovement(input);
    this.updateCompanion();
    this.checkLandmarks();
    this.updateNavArrow();
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

  updateCompanion() {
    // Bell trails a fixed step behind Line's facing direction — a simple
    // stand-in for "walking together" until real side-by-side art exists.
    const offsets = {
      down: [0, -COMPANION_OFFSET],
      up: [0, COMPANION_OFFSET],
      left: [COMPANION_OFFSET, 0],
      right: [-COMPANION_OFFSET, 0],
    };
    const [ox, oy] = offsets[this.player.facing];
    const targetX = this.player.x + ox;
    const targetY = this.player.y + oy;
    const moving = Phaser.Math.Distance.Between(this.companion.x, this.companion.y, targetX, targetY) > 4;

    this.companion.x = Phaser.Math.Linear(this.companion.x, targetX, 0.18);
    this.companion.y = Phaser.Math.Linear(this.companion.y, targetY, 0.18);
    this.companion.facing = this.player.facing;
    applyWalkAnim(this.companion, 'bell', this.companion.facing, moving);
    ySortDepth(this.companion);
  }

  updateNavArrow() {
    const remaining = this.markers.filter((spot) => !spot.collected);
    if (remaining.length === 0) {
      this.navArrow.setVisible(false);
      return;
    }
    let nearest = remaining[0];
    let nearestDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, nearest.x, nearest.y);
    remaining.forEach((spot) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, spot.x, spot.y);
      if (dist < nearestDist) {
        nearest = spot;
        nearestDist = dist;
      }
    });

    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y);
    const radius = 34;
    this.navArrow.setVisible(true);
    this.navArrow.setPosition(
      this.player.x + Math.cos(angle) * radius,
      this.player.y + Math.sin(angle) * radius - 6,
    );
    this.navArrow.setRotation(angle + Math.PI / 2);
  }

  checkLandmarks() {
    this.markers.forEach((spot) => {
      if (spot.collected) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, spot.x, spot.y);
      if (dist <= COLLECT_RANGE) this.collectLandmark(spot);
    });
  }

  collectLandmark(spot) {
    spot.collected = true;
    this.collectedCount += 1;
    spot.marker.setTexture('landmark_done');
    this.progressText.setText(`${this.collectedCount}/${this.markers.length} lugares`);
    this.showToast(spot.text);

    if (this.collectedCount >= this.markers.length) {
      this.time.delayedCall(1800, () => this.startClosingLine());
    }
  }

  showToast(text) {
    this.toastText.setText(text);
    this.tweens.killTweensOf(this.toastText);
    this.toastText.setAlpha(1);
    this.tweens.add({
      targets: this.toastText,
      alpha: 0,
      delay: 1500,
      duration: 500,
    });
  }

  startClosingLine() {
    this.controls.setMovementEnabled(false);
    this.dialogue.open([
      { speaker: 'narrator', text: 'O dia em que a gente andou Belo Horizonte de ponta a ponta.' },
      { speaker: 'narrator', text: 'Sol, árvore, seu rosto encostado no meu. Eu fui eu, sem o resto.' },
    ]);
  }

  finishChapter() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.scene.start('Chapter6');
  }
}

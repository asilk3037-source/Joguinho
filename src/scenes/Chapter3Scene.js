import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import { chapter3Steps } from '../data/chapter3Dialogue.js';

const WORLD_W = 720;
const WORLD_H = 1100;
const PLAYER_SPEED = 150;
const INTERACT_RANGE = 46;

export default class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super('Chapter3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f1e6c8');
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'floor_tile').setOrigin(0, 0);

    this.tables = this.physics.add.staticGroup();
    const tablePositions = [
      [180, 260], [420, 260], [300, 380], [540, 380],
      [180, 500], [420, 500], [300, 620], [540, 620],
    ];
    tablePositions.forEach(([x, y]) => this.tables.create(x, y, 'table'));

    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H - 100, 'line_down');
    this.player.setSize(20, 22).setOffset(6, 8);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'down';

    this.bell = this.physics.add.staticSprite(WORLD_W / 2, 190, 'bell_down');

    this.physics.add.collider(this.player, this.tables);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.controls = new TouchControls(this);
    this.dialogue = new DialogueBox(this);

    this.interactHint = this.add
      .text(this.bell.x, this.bell.y - 30, 'toque A para falar com a Bell', {
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

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * PLAYER_SPEED;
      vy = (vy / len) * PLAYER_SPEED;

      if (Math.abs(vx) > Math.abs(vy)) {
        this.player.facing = vx > 0 ? 'right' : 'left';
      } else {
        this.player.facing = vy > 0 ? 'down' : 'up';
      }
      this.player.setTexture(`line_${this.player.facing}`);
    }

    this.player.setVelocity(vx, vy);
  }

  onDialogueComplete() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.controls.setVisible(false);

    const { width, height } = this.scale;
    // Plain scene objects, each with its own setScrollFactor(0) — a
    // Container here would have the same broken hit-testing as the
    // dialogue box choice buttons once the camera has scrolled (see the
    // comment at the top of DialogueBox.js).
    this.add.rectangle(width / 2, height / 2, width, height, 0x120c14, 0.92).setScrollFactor(0).setDepth(2000);
    this.add
      .text(width / 2, height * 0.44, 'Fim do capítulo\n(protótipo)', {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#e8c07d',
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000);
    const restart = this.add
      .text(width / 2, height * 0.58, 'toque para voltar ao título', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#f4ece2',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setInteractive({ useHandCursor: true });
    restart.on('pointerdown', () => this.scene.start('Title'));
  }
}

import Phaser from 'phaser';
import TouchControls from '../ui/TouchControls.js';
import DialogueBox from '../ui/DialogueBox.js';
import ChipHud from '../ui/ChipHud.js';
import { faceFromVector, applyWalkAnim, ySortDepth } from '../ui/spriteAnim.js';
import { chapter3Steps } from '../data/chapter3Dialogue.js';
import { chapter3LeaveMallSteps, chapter3PlaygroundSteps } from '../data/chapter3PlaygroundDialogue.js';

const WORLD_W = 720;
const WORLD_H = 1280;
const PLAYER_SPEED = 150;
const INTERACT_RANGE = 60;

// The whole first date (09/05/2024), told as three stops in one scene:
// the food court, a playground with a punch machine, and the tunnel
// where they had their first kiss — all real beats from that day.
const SPOTS = {
  mall: { bg: 'mall_bg', bellPos: [360, 640], playerStart: [360, 1190] },
  playground: { bg: 'playground_bg', bellPos: [430, 560], playerStart: [360, 1150], punchPos: [300, 560] },
  tunnel: { bg: 'tunnel_bg', bellPos: [360, 420], playerStart: [360, 1150] },
};

export default class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super('Chapter3');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.bg = this.add.image(0, 0, SPOTS.mall.bg).setOrigin(0, 0);

    this.player = this.physics.add.sprite(SPOTS.mall.playerStart[0], SPOTS.mall.playerStart[1], 'line_walk4', 0);
    this.player.setSize(28, 18).setOffset(22, 48);
    this.player.setCollideWorldBounds(true);
    this.player.facing = 'up';

    const [bellX, bellY] = SPOTS.mall.bellPos;
    this.bell = this.physics.add.staticSprite(bellX, bellY, 'bell_walk4', 0);
    this.bell.setDepth(bellY);

    this.eatSprite = this.add
      .sprite(bellX, bellY + 60, 'eat36', 0)
      .setDisplaySize(300, 300)
      .setVisible(false)
      .setDepth(bellY + 61);
    this.punchSprite = this.add.sprite(0, 0, 'punch16', 0).setDisplaySize(150, 150).setVisible(false);
    this.kissSprite = this.add.sprite(0, 0, 'kiss8', 0).setDisplaySize(260, 346).setVisible(false);

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

    this.location = 'mall';
    this.stage = 'explore'; // explore | busy (dialogue/cutscene running)
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
    if (this.chapterEnded || this.stage !== 'explore') return;

    const input = this.controls.poll();

    if (this.dialogue.isActive()) {
      this.player.setVelocity(0, 0);
      this.interactHint.setVisible(false);
      if (input.action) this.dialogue.advance();
      return;
    }

    const interactTarget = this.location === 'playground' ? { x: SPOTS.playground.punchPos[0], y: SPOTS.playground.punchPos[1] } : this.bell;
    const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, interactTarget.x, interactTarget.y) <= INTERACT_RANGE;
    this.interactHint.setVisible(near);

    if (input.action && near) {
      this.controls.setMovementEnabled(false);
      this.onInteract();
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

  onInteract() {
    if (this.location === 'mall') {
      this.player.setVisible(false);
      this.bell.setVisible(false);
      this.eatSprite.setVisible(true).play('eat_loop');
      this.dialogue.open(chapter3Steps, () => this.afterEating());
    } else if (this.location === 'playground') {
      this.stage = 'busy';
      this.player.setVelocity(0, 0);
      this.player.setVisible(false);
      this.bell.setVisible(false);
      this.punchSprite.setPosition(SPOTS.playground.punchPos[0], SPOTS.playground.punchPos[1]).setVisible(true);
      this.punchSprite.play('punch_play');
      const laughSprite = this.add
        .sprite(SPOTS.playground.bellPos[0], SPOTS.playground.bellPos[1], 'laugh16', 0)
        .setDisplaySize(150, 185)
        .play('laugh_loop');
      this.punchSprite.once('animationcomplete', () => {
        laughSprite.destroy();
        this.stage = 'explore';
        this.dialogue.open(chapter3PlaygroundSteps, () => this.goTo('tunnel'));
      });
    } else if (this.location === 'tunnel') {
      this.stage = 'busy';
      this.player.setVelocity(0, 0);
      this.player.setVisible(false);
      this.bell.setVisible(false);
      this.kissSprite.setPosition(this.bell.x, this.bell.y - 20).setVisible(true).play('kiss_play');
      this.kissSprite.once('animationcomplete', () => {
        this.time.delayedCall(1400, () => this.onDialogueComplete());
      });
    }
  }

  afterEating() {
    this.eatSprite.setVisible(false);
    this.player.setVisible(true);
    this.bell.setVisible(true);
    this.dialogue.open(chapter3LeaveMallSteps, () => this.goTo('playground'));
  }

  // Fades out, swaps the background and re-places the actors, fades back
  // in — a plain crossfade between the three stops of the date.
  goTo(location) {
    this.cameras.main.fadeOut(420, 20, 12, 20);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.location = location;
      const spot = SPOTS[location];
      this.bg.setTexture(spot.bg);
      this.player.setPosition(spot.playerStart[0], spot.playerStart[1]);
      this.player.setVisible(true);
      this.player.facing = 'up';
      applyWalkAnim(this.player, 'line', 'up', false);
      this.bell.setPosition(spot.bellPos[0], spot.bellPos[1]);
      this.bell.setDepth(spot.bellPos[1]);
      this.bell.setVisible(true);
      this.interactHint.setPosition(spot.bellPos[0], spot.bellPos[1] - 46);

      // Defensive cleanup: whatever cutscene sprite/dialogue the previous
      // stop left on screen must not bleed into the new one.
      this.eatSprite.setVisible(false);
      this.punchSprite.setVisible(false);
      this.kissSprite.setVisible(false);
      if (this.dialogue.isActive()) this.dialogue.close();

      this.stage = 'explore';
      this.controls.setMovementEnabled(true);
      this.cameras.main.fadeIn(420);
    });
  }

  onDialogueComplete() {
    this.chapterEnded = true;
    this.player.setVelocity(0, 0);
    this.scene.start('Chapter4');
  }
}

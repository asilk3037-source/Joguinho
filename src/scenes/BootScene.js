import Phaser from 'phaser';

// Generates every placeholder texture the prototype still needs, and loads
// the real art that has arrived so far (see ART_BRIEFS.md for what's still
// missing). Swapping in more real art later only touches this file plus
// whichever scene references the new texture key.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Real character walk cycles: 4 rows (down/left/right/up) x 24 frames,
    // a much smoother cycle than the first pass. Line's cell is 72x72,
    // Bell's is 64x64 — different source art, same grid shape.
    this.load.spritesheet('line_walk4', 'assets/animations/line_walk4.png', {
      frameWidth: 72,
      frameHeight: 72,
    });
    this.load.spritesheet('bell_walk4', 'assets/animations/bell_walk4.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Real dialogue portraits for both, matching art style: 3x2 grid,
    // 128x128 per frame. Frame order: neutral, smile, laugh, surprised,
    // blush, nervous (see DialogueBox.js EXPRESSION_FRAMES).
    this.load.spritesheet('line_portraits', 'assets/portraits/line_portraits.png', {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet('bell_portraits', 'assets/portraits/bell_portraits.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    // Real scenery backgrounds.
    this.load.image('mall_bg', 'assets/backgrounds/mall.png');
    this.load.image('tunnel_bg', 'assets/backgrounds/tunnel.png');

    // Real action clips: both sitting eating (36 frames, 6x6 grid) and the
    // Sapucaí embrace (8 frames in a row).
    this.load.spritesheet('eat36', 'assets/animations/eat36.png', {
      frameWidth: 160,
      frameHeight: 160,
    });
    this.load.spritesheet('kiss8', 'assets/animations/kiss8.png', {
      frameWidth: 150,
      frameHeight: 200,
    });
  }

  create() {
    this.createWalkAnims4('line', 24);
    this.createWalkAnims4('bell', 24);

    this.anims.create({
      key: 'eat_loop',
      frames: this.anims.generateFrameNumbers('eat36', { start: 0, end: 35 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'kiss_play',
      frames: this.anims.generateFrameNumbers('kiss8', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 0,
    });

    this.makeFloorTile();
    this.makeDirButton('dpad_up', 'up');
    this.makeDirButton('dpad_down', 'down');
    this.makeDirButton('dpad_left', 'left');
    this.makeDirButton('dpad_right', 'right');
    this.makeActionButton();
    this.makeHeart();
    this.makeJersey('bell_cruzeiro', 0x1a4fa0);
    this.makeJersey('bell_galo', 0x161616);
    this.makeStar();
    this.makeLandmarkMarker();
    this.makeNavArrow();

    this.scene.start('Title');
  }

  // Row order in both line_walk4.png and bell_walk4.png: 0 down, 1 left,
  // 2 right, 3 up — each row is `framesPerDir` frames of that walk cycle.
  createWalkAnims4(key, framesPerDir) {
    const sheet = `${key}_walk4`;
    const dirs = ['down', 'left', 'right', 'up'];
    dirs.forEach((dir, row) => {
      const start = row * framesPerDir;
      const end = start + framesPerDir - 1;
      this.anims.create({
        key: `${key}_walk_${dir}`,
        frames: this.anims.generateFrameNumbers(sheet, { start, end }),
        frameRate: 18,
        repeat: -1,
      });
    });
  }

  makeFloorTile() {
    const g = this.add.graphics();
    g.fillStyle(0xf1e6c8, 1);
    g.fillRect(0, 0, 32, 32);
    g.lineStyle(1, 0xdccfa4, 1);
    g.strokeRect(0, 0, 32, 32);
    g.generateTexture('floor_tile', 32, 32);
    g.destroy();
  }

  makeDirButton(key, dir) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.28);
    g.fillCircle(28, 28, 28);
    g.lineStyle(2, 0xffffff, 0.5);
    g.strokeCircle(28, 28, 28);
    g.fillStyle(0xffffff, 0.85);
    const cx = 28;
    const cy = 28;

    // Simple arrow triangles per direction
    g.beginPath();
    if (dir === 'up') {
      g.moveTo(cx, cy - 10);
      g.lineTo(cx - 8, cy + 6);
      g.lineTo(cx + 8, cy + 6);
    } else if (dir === 'down') {
      g.moveTo(cx, cy + 10);
      g.lineTo(cx - 8, cy - 6);
      g.lineTo(cx + 8, cy - 6);
    } else if (dir === 'left') {
      g.moveTo(cx - 10, cy);
      g.lineTo(cx + 6, cy - 8);
      g.lineTo(cx + 6, cy + 8);
    } else {
      g.moveTo(cx + 10, cy);
      g.lineTo(cx - 6, cy - 8);
      g.lineTo(cx - 6, cy + 8);
    }
    g.closePath();
    g.fillPath();
    g.generateTexture(key, 56, 56);
    g.destroy();
  }

  makeActionButton() {
    const g = this.add.graphics();
    g.fillStyle(0xe8c07d, 0.9);
    g.fillCircle(28, 28, 28);
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeCircle(28, 28, 28);
    g.generateTexture('action_btn', 56, 56);
    g.destroy();
  }

  makeHeart() {
    const g = this.add.graphics();
    g.fillStyle(0xe86b8a, 1);
    g.fillCircle(9, 9, 7);
    g.fillCircle(19, 9, 7);
    g.fillTriangle(2, 12, 26, 12, 14, 26);
    g.generateTexture('heart', 28, 28);
    g.destroy();
  }

  // Bigger portrait-style bust used only for the Galo x Cruzeiro reveal
  // beat, not the walking spritesheet.
  makeJersey(key, jerseyColor) {
    const g = this.add.graphics();
    g.fillStyle(0xd98a8a, 1);
    g.fillCircle(32, 22, 16); // face
    g.fillStyle(jerseyColor, 1);
    g.fillRoundedRect(10, 34, 44, 34, 8);
    g.lineStyle(2, 0xffffff, 0.6);
    g.strokeRoundedRect(10, 34, 44, 34, 8);
    // glasses
    g.fillStyle(0xffffff, 0.9);
    g.fillRect(20, 19, 8, 4);
    g.fillRect(34, 19, 8, 4);
    if (key === 'bell_galo') {
      g.fillStyle(0xffffff, 1);
      g.fillRect(28, 40, 8, 22);
    }
    g.generateTexture(key, 64, 68);
    g.destroy();
  }

  makeStar() {
    const g = this.add.graphics();
    g.fillStyle(0xf4ece2, 0.9);
    g.fillCircle(3, 3, 3);
    g.generateTexture('star', 6, 6);
    g.destroy();
  }

  makeLandmarkMarker() {
    const g = this.add.graphics();
    g.fillStyle(0xe8c07d, 1);
    g.fillCircle(12, 12, 11);
    g.lineStyle(2, 0xffffff, 0.9);
    g.strokeCircle(12, 12, 11);
    g.generateTexture('landmark', 24, 24);
    g.destroy();

    const gDone = this.add.graphics();
    gDone.fillStyle(0xe86b8a, 1);
    gDone.fillCircle(12, 12, 11);
    gDone.lineStyle(2, 0xffffff, 0.9);
    gDone.strokeCircle(12, 12, 11);
    gDone.generateTexture('landmark_done', 24, 24);
    gDone.destroy();
  }

  // Points from the player toward the nearest uncollected landmark (see
  // Chapter5Scene's nav arrow). Drawn pointing "up" by default; scenes
  // rotate it to the real bearing with setRotation().
  makeNavArrow() {
    const g = this.add.graphics();
    g.fillStyle(0xe8c07d, 0.95);
    g.lineStyle(2, 0x1c1420, 0.5);
    g.beginPath();
    g.moveTo(11, 0);
    g.lineTo(22, 18);
    g.lineTo(11, 13);
    g.lineTo(0, 18);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.generateTexture('nav_arrow', 22, 18);
    g.destroy();
  }
}

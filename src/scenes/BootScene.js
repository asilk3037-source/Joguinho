import Phaser from 'phaser';

// Generates every placeholder texture the prototype needs, so no art files
// are required yet. Swap these for real spritesheets later (see
// ART_BRIEFS.md) without touching any other scene.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.makeCharacterTextures('line', 0x2b2b3d, 0xe8c07d);
    this.makeCharacterTextures('bell', 0xd98a8a, 0x3a2a3d);
    this.makeFloorTile();
    this.makeTable();
    this.makeDirButton('dpad_up', 'up');
    this.makeDirButton('dpad_down', 'down');
    this.makeDirButton('dpad_left', 'left');
    this.makeDirButton('dpad_right', 'right');
    this.makeActionButton();
    this.makeHeart();

    this.scene.start('Title');
  }

  makeCharacterTextures(key, bodyColor, accentColor) {
    const dirs = ['down', 'up', 'left', 'right'];
    dirs.forEach((dir) => {
      const g = this.add.graphics();
      g.fillStyle(bodyColor, 1);
      g.fillRoundedRect(4, 4, 24, 24, 6);
      g.lineStyle(2, 0x000000, 0.35);
      g.strokeRoundedRect(4, 4, 24, 24, 6);

      // glasses hint for Bell, always visible near the top of the sprite
      if (key === 'bell') {
        g.fillStyle(0xffffff, 0.9);
        g.fillRect(10, 9, 5, 3);
        g.fillRect(17, 9, 5, 3);
      }

      // facing indicator so the placeholder still reads as directional
      g.fillStyle(accentColor, 1);
      const marks = {
        down: [13, 22, 6, 4],
        up: [13, 6, 6, 4],
        left: [6, 13, 4, 6],
        right: [22, 13, 4, 6],
      };
      const [mx, my, mw, mh] = marks[dir];
      g.fillRect(mx, my, mw, mh);

      g.generateTexture(`${key}_${dir}`, 32, 32);
      g.destroy();
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

  makeTable() {
    const g = this.add.graphics();
    g.fillStyle(0x8b5e3c, 1);
    g.fillRoundedRect(0, 0, 32, 32, 4);
    g.lineStyle(2, 0x5c3b22, 1);
    g.strokeRoundedRect(0, 0, 32, 32, 4);
    g.generateTexture('table', 32, 32);
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
}

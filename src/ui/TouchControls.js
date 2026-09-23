import Phaser from 'phaser';

// Virtual d-pad (movement) + a single round action button (interact /
// advance dialogue). Works with touch and mouse, and mirrors the arrow
// keys / space bar so desktop testing works too.
export default class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.state = { up: false, down: false, left: false, right: false };

    const { width, height } = scene.scale;
    const depth = 1000;
    const pad = 66;
    const originX = 78;
    const originY = height - 96;

    this.buttons = {};
    this.buttons.up = this.addButton('dpad_up', originX, originY - pad, depth, 'up');
    this.buttons.down = this.addButton('dpad_down', originX, originY + pad, depth, 'down');
    this.buttons.left = this.addButton('dpad_left', originX - pad, originY, depth, 'left');
    this.buttons.right = this.addButton('dpad_right', originX + pad, originY, depth, 'right');

    this.actionButton = scene.add
      .image(width - 70, height - 96, 'action_btn')
      .setScrollFactor(0)
      .setDepth(depth)
      .setInteractive({ useHandCursor: true });
    scene.add
      .text(width - 70, height - 96, 'A', {
        fontFamily: 'sans-serif',
        fontSize: '20px',
        color: '#2b1f2a',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);

    this.actionJustPressed = false;
    this.actionButton.on('pointerdown', () => {
      this.actionJustPressed = true;
      this.actionButton.setScale(0.9);
    });
    this.actionButton.on('pointerup', () => this.actionButton.setScale(1));
    this.actionButton.on('pointerout', () => this.actionButton.setScale(1));

    this.cursors = scene.input.keyboard ? scene.input.keyboard.createCursorKeys() : null;
    this.spaceKey = scene.input.keyboard
      ? scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      : null;
    this.wasd = scene.input.keyboard
      ? scene.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        })
      : null;
  }

  addButton(texture, x, y, depth, dir) {
    const btn = this.scene.add
      .image(x, y, texture)
      .setScrollFactor(0)
      .setDepth(depth)
      .setInteractive();

    const setState = (value) => {
      this.state[dir] = value;
      btn.setScale(value ? 0.9 : 1);
    };

    btn.on('pointerdown', () => setState(true));
    btn.on('pointerup', () => setState(false));
    btn.on('pointerout', () => setState(false));

    return btn;
  }

  // Call once per frame from the scene's update().
  poll() {
    const up = this.state.up || (this.cursors && this.cursors.up.isDown) || (this.wasd && this.wasd.up.isDown);
    const down = this.state.down || (this.cursors && this.cursors.down.isDown) || (this.wasd && this.wasd.down.isDown);
    const left = this.state.left || (this.cursors && this.cursors.left.isDown) || (this.wasd && this.wasd.left.isDown);
    const right = this.state.right || (this.cursors && this.cursors.right.isDown) || (this.wasd && this.wasd.right.isDown);

    const actionKeyPressed = this.spaceKey ? Phaser.Input.Keyboard.JustDown(this.spaceKey) : false;
    const action = this.actionJustPressed || actionKeyPressed;
    this.actionJustPressed = false;

    return { up, down, left, right, action };
  }

  setVisible(visible) {
    Object.values(this.buttons).forEach((b) => b.setVisible(visible));
    this.actionButton.setVisible(visible);
  }

  // Used while a dialogue box is open: movement is locked, and the d-pad's
  // hit areas sit under the dialogue's choice buttons, so it must stop
  // intercepting pointer events (not just hide) or taps land on the wrong
  // thing. The action button stays live since it also advances dialogue.
  setMovementEnabled(enabled) {
    Object.values(this.buttons).forEach((b) => {
      b.setVisible(enabled);
      if (enabled) b.setInteractive();
      else b.disableInteractive();
      this.state.up = false;
      this.state.down = false;
      this.state.left = false;
      this.state.right = false;
    });
  }
}

// Shared helpers for the two real character spritesheets (line_sheet,
// bell_sheet), both laid out as 4x4 grids: frame 0/4/8/12 are the idle
// frame for down/right/left/up respectively (see BootScene.js preload()).
const IDLE_FRAMES = { down: 0, right: 4, left: 8, up: 12 };

export function faceFromVector(vx, vy, currentFacing) {
  if (vx === 0 && vy === 0) return currentFacing;
  if (Math.abs(vx) > Math.abs(vy)) return vx > 0 ? 'right' : 'left';
  return vy > 0 ? 'down' : 'up';
}

export function applyWalkAnim(sprite, key, facing, moving) {
  if (moving) {
    sprite.anims.play(`${key}_walk_${facing}`, true);
  } else {
    sprite.anims.stop();
    sprite.setTexture(`${key}_sheet`, IDLE_FRAMES[facing]);
  }
}

// Standard top-down trick: whoever is lower on screen (bigger y) is
// physically closer to the camera, so they draw on top. Without this two
// characters visually swap which one is "in front" depending on draw
// order instead of position, which reads as them walking through each
// other whenever their paths cross.
export function ySortDepth(sprite) {
  sprite.setDepth(sprite.y);
}

export { IDLE_FRAMES };

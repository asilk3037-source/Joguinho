// Shared helpers for the real character spritesheets (line_walk4,
// bell_walk4): 4 rows (down/left/right/up), 24 frames each — see
// BootScene.js preload()/createWalkAnims4() for the exact grid.
const DIRS = ['down', 'left', 'right', 'up'];
const FRAMES_PER_DIR = 24;

export function faceFromVector(vx, vy, currentFacing) {
  if (vx === 0 && vy === 0) return currentFacing;
  if (Math.abs(vx) > Math.abs(vy)) return vx > 0 ? 'right' : 'left';
  return vy > 0 ? 'down' : 'up';
}

export function idleFrame(dir) {
  return DIRS.indexOf(dir) * FRAMES_PER_DIR;
}

export function applyWalkAnim(sprite, key, facing, moving) {
  if (moving) {
    sprite.anims.play(`${key}_walk_${facing}`, true);
  } else {
    sprite.anims.stop();
    sprite.setTexture(`${key}_walk4`, idleFrame(facing));
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

// Small rounded "chip" badges pinned to the top corners of the screen
// (location on the left, date on the right), matching the reference
// mockup's persistent HUD. Cream/plum sticker style, same family as
// DialogueBox.
export default class ChipHud {
  constructor(scene, leftText, rightText) {
    const { width } = scene.scale;
    const depth = 500;
    const y = 26;

    this.left = this.makeChip(scene, leftText, 16, y, 'left', depth);
    this.right = this.makeChip(scene, rightText, width - 16, y, 'right', depth);
  }

  makeChip(scene, text, x, y, align, depth) {
    const label = scene.add
      .text(0, 0, text, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#4c354e',
        fontStyle: '800',
      })
      .setOrigin(align === 'left' ? 0 : 1, 0.5);

    const padX = 12;
    const padY = 8;
    const w = label.width + padX * 2;
    const h = label.height + padY * 2;
    const boxX = align === 'left' ? x : x - w;

    const g = scene.add.graphics().setScrollFactor(0).setDepth(depth);
    g.fillStyle(0x3f2b46, 1);
    g.fillRoundedRect(boxX, y - h / 2 + 3, w, h, 12);
    g.fillStyle(0xfff8ed, 0.93);
    g.fillRoundedRect(boxX, y - h / 2, w, h, 12);
    g.lineStyle(2, 0x6f4c67, 1);
    g.strokeRoundedRect(boxX, y - h / 2, w, h, 12);

    label.setPosition(align === 'left' ? boxX + padX : boxX + w - padX, y);
    label.setScrollFactor(0).setDepth(depth + 1);

    return { g, label };
  }
}

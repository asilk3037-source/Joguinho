import Phaser from 'phaser';

// Temporary wrap-up screen after Chapter 6 — the "day one" arc from the
// GAME_DESIGN.md storyline is complete. The interlúdio de viagem, o pedido
// and a carta final are the next chapters to build.
export default class EndOfPrototypeScene extends Phaser.Scene {
  constructor() {
    super('EndOfPrototype');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#120c14');

    this.add
      .text(width / 2, height * 0.22, 'Fim do "Dia 1"', {
        fontFamily: 'Georgia, serif',
        fontSize: '28px',
        color: '#e8c07d',
      })
      .setOrigin(0.5);

    this.add.image(width / 2, height * 0.32, 'heart').setScale(1.6);

    this.add
      .text(
        width / 2,
        height * 0.44,
        'Prólogo → Dois Julius → Galo×Cruzeiro →\nMinas Shopping → apelidos →\na pé por BH → Sapucaí',
        {
          fontFamily: 'sans-serif',
          fontSize: '13px',
          color: '#c9b8c4',
          align: 'center',
          lineSpacing: 6,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.62, 'A seguir: a linha do tempo de viagens,\no pedido de casamento e a carta final.', {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#8a7b86',
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(width / 2, height * 0.78, 'toque para jogar de novo', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#f4ece2',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    restart.on('pointerdown', () => this.scene.start('Title'));
  }
}

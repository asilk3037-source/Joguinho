// Real lines from the "Minas Shopping" chapter (09/05/2024 — first date),
// taken from the meu-amor site. Keep any future edits faithful to that source.
export const chapter3Steps = [
  { speaker: 'bell', text: '"A praça de alimentação é grande né kk."' },
  { speaker: 'bell', text: '"eu tô te vendo kkkk"' },
  { speaker: 'narrator', text: 'Você avista a Bell sentada perto do letreiro luminoso, rindo do próprio comentário.' },
  {
    type: 'choice',
    text: 'Ela empurra uma lata na sua direção: "pode confiar, é Coca."',
    options: [
      { label: 'Confiar nela', reply: '"Mentira, era Pepsi o tempo todo kkkk" — ela ri sem parar da própria treta.' },
      { label: 'Desconfiar', reply: '"Ih, te peguei! Era Pepsi mesmo kkkk" — ela confessa entre risadas.' },
    ],
  },
  { speaker: 'bell', text: '"Você SUPEROU TODAS AS MINHAS EXPECTATIVAS"' },
  {
    speaker: 'bell',
    text: '"a primeira vez que eu não tive que me moldar com medo de assustar a pessoa por ser eu mesma"',
  },
  { speaker: 'line', text: '"voltei pra casa saltitante, foi muito bom"' },
];

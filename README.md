# Bell & Line

Jogo em pixel art para navegador (mobile-first), contando a história real da
Line e da Bell. Veja `GAME_DESIGN.md` para o enredo completo e `ART_BRIEFS.md`
para a lista de artes necessárias.

## Status atual

Protótipo jogável do **Capítulo 3 — "No Minas Shopping"**, com placeholders
coloridos no lugar da arte final. Já validado nele:

- Movimento por d-pad virtual (touch) e setas/WASD (teclado)
- Câmera seguindo a personagem, colisão com obstáculos
- Interação com NPC (Bell) por proximidade + botão de ação
- Caixa de diálogo com falas reais do site `meu-amor`
- Uma escolha de diálogo ramificada (a piada da Coca/Pepsi)
- Transição de fim de capítulo

## Como rodar

```bash
npm install
npm run dev       # ambiente de desenvolvimento, com hot reload
```

Abra a URL que o Vite mostrar no terminal — no celular, acesse pela rede
local usando o endereço "Network" que aparece no console.

Para gerar a versão final estática (pronta pra hospedar em GitHub Pages,
Netlify, etc.):

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve a build de produção localmente, pra conferir
```

## Estrutura do código

```
src/
  main.js                 # config do Phaser e lista de cenas
  scenes/
    BootScene.js           # gera as texturas placeholder (sem precisar de arte)
    TitleScene.js           # tela de título
    Chapter3Scene.js        # capítulo jogável (Minas Shopping)
  ui/
    TouchControls.js        # d-pad + botão de ação (touch e teclado)
    DialogueBox.js           # caixa de diálogo com suporte a escolhas
  data/
    chapter3Dialogue.js      # falas do capítulo, extraídas do site original
```

Quando a arte pixel art for chegando (ver `ART_BRIEFS.md`), trocar as
texturas geradas em `BootScene.js` por `this.load.spritesheet(...)` /
`this.load.image(...)` reais é a única mudança necessária — o resto do
código (movimento, colisão, diálogo) já funciona igual.

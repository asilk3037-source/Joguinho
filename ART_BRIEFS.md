# Bell & Line — Briefing de Arte (Pixel Art)

Descrição de cada asset necessário pro jogo, pronta pra passar a um artista ou
usar como prompt em ferramenta de geração de imagem. Baseado nas fotos reais
(`fotos/galo.jpg` e `fotos/pedido-16.jpg`) pra manter a semelhança.

## 0. Guia de estilo geral

- **Resolução dos personagens:** 32×32 px por frame (dá pra ler expressão e
  roupa numa tela de celular). Referência de estilo: Stardew Valley / Eastward
  / Celeste — pixel "limpo", contorno sutil (1px), poucas cores por sprite (12–16).
- **Resolução dos tiles de cenário:** 32×32 px, grid consistente com os personagens.
- **Paleta geral do jogo:** tons quentes (laranja/dourado pôr do sol) para as
  cenas de dia em BH; azul/roxo profundo pra cena noturna da Sapucaí; preto e
  branco pro Galo; azul pro Cruzeiro; branco/dourado suave pra cena do pedido.
- **Formato de entrega:** PNG com fundo transparente, spritesheets em grid
  (facilita importar no Phaser 3). Se possível, um arquivo por personagem/tileset,
  nomeado como nos exemplos de cada item abaixo.
- **Perspectiva:** top-down levemente angulado (3/4), igual RPG clássico — não
  side-scroller.

## 1. Personagens principais

### Line (jogável)
Referência física (foto do pedido): pele morena clara/bronzeada, cabelo liso
escuro (preto/castanho muito escuro), comprimento até o meio das costas, usa
roupas em tons escuros no dia a dia (preto, jeans escuro).

**Sprites necessários:**
1. `line_walk.png` — spritesheet de caminhada, 4 direções (baixo, cima, esquerda,
   direita), 3–4 frames por direção + 1 frame idle por direção. Roupa casual do
   dia a dia (camiseta escura, calça jeans escura).
2. `line_portrait.png` — bustos ~64×64 pra caixa de diálogo, expressões: neutro,
   sorriso, rindo/gargalhando, surpresa, apaixonada/corada, nervosa (cena do pedido).
3. `line_kneel.png` — pose específica ajoelhada com caixinha de anel na mão,
   pro capítulo final do pedido (referência direta: `pedido-16.jpg`).
4. `line_office.png` (opcional, capítulo 1) — variante de roupa de trabalho/TI
   (pode reaproveitar o walk cycle só trocando a cor da roupa pra algo mais "office").

### Bell (par romântico / NPC)
Referência física (fotos): pele clara, cabelo liso castanho longo (abaixo dos
ombros, com franja repartida ao meio), óculos de armação redonda em tartaruga,
olhos verdes (mencionados no site: "gatinha do zoi verde"), sorriso bem aberto.

**Sprites necessários:**
5. `bell_walk.png` — spritesheet de caminhada, 4 direções, mesmo padrão da Line.
   Roupa casual (pode variar por capítulo, mas manter óculos e cabelo como
   marca registrada visual).
6. `bell_portrait.png` — bustos ~64×64, mesmas expressões da Line + uma
   expressão "brava de brincadeira" (implicância mencionada no site).
7. `bell_walk_cruzeiro.png` — variante com camisa azul do Cruzeiro, usada só
   no capítulo 2 antes do twist.
8. `bell_walk_galo.png` — variante com camisa preto e branco do Galo (referência:
   `fotos/galo.jpg`), usada do capítulo 2 (após o twist) em diante — é a
   variante "padrão" dela no resto do jogo.
9. `bell_portrait_galo_reveal.png` — um frame especial de "revelação" (ela
   abrindo o casaco/camisa pra mostrar o escudo do Galo, tipo herói revelando
   símbolo) — é o momento cômico-chave do capítulo 2.
10. `bell_dress_pedido.png` — variante com vestido branco leve, pro capítulo
    final do pedido (referência: `pedido-16.jpg`).

### Pose combinada
11. `couple_holdhands.png` — as duas sprites lado a lado de mãos dadas,
    andando juntas (usado no capítulo 5, "a cidade toda a pé"). Pode ser feito
    como uma sprite composta de 4 direções também, ou como duas sprites
    sincronizadas — decisão de implementação, mas a arte precisa cobrir o gesto
    de mão dada nas 4 direções.

## 2. Cenários / tilesets

12. `tileset_street_day.png` — rua de cidade genérica, tons quentes de dia:
    calçada, poste, arvorezinha, fiação, prédios baixos de fundo. Usado no
    prólogo (cutscene do cruzamento) e transições.
13. `tileset_street_night.png` — mesma rua, paleta noturna azul/roxa com postes
    acesos, pra fechar o prólogo com a notificação do Happn.
14. `tileset_shopping.png` — praça de alimentação: mesas redondas, cadeiras,
    balcão de fast-food genérico (sem marca), letreiro luminoso, piso xadrez
    claro. Capítulo 3.
15. `tileset_stadium.png` — arquibancada estilizada simples (fileiras de
    assento cinza, como na foto do Galo), pode ser só um recorte parcial —
    não precisa ser um estádio completo, é uma cena curta. Capítulo 2.
16. `tileset_bh_overworld.png` — o mapa principal de BH estilizado com os
    marcos: Mineirão (estádio icônico), Lagoa da Pampulha (água + Igrejinha da
    Pampulha ao fundo), Mercado Central (fachada colorida), prédios da Savassi,
    Praça da Liberdade (palacete + gramado). Capítulo 5 — é o tileset mais
    trabalhoso, pode ser feito em módulos (um "quarteirão" pixelado por marco).
17. `tileset_sapucai_night.png` — Viaduto Santa Tereza à noite, céu estrelado,
    luzes da cidade ao fundo, clima intimista. Capítulo 6.
18. `map_travel.png` — mapa estilizado de Minas Gerais + litoral + Rio de
    Janeiro, visão aérea tipo mapa de RPG (verde/bege pro estado, azul pro mar),
    com espaço pra marcar pontos: Belo Horizonte, Contagem, Santa Luzia, Pedro
    Leopoldo, Matozinhos, Lavras Novas, São Tomé das Letras, estrada até
    Guarapari, Barra da Tijuca, Centro do Rio/Museu do Amanhã, Queimados.
    Interlúdio de viagem.
19. `scene_pedido.png` — cenário do pedido: jardim/praça com prédio histórico
    ao fundo (referência: `pedido-16.jpg` — prédio estilo colonial, palmeiras,
    arbustos podados), tons dourados de fim de tarde.
20. `scene_epilogo.png` — fundo de encerramento: as duas sentadas olhando um
    pôr do sol/entardecer sobre o skyline de BH, silhueta.

## 3. UI / HUD / props

21. `ui_dialogbox.png` — moldura da caixa de diálogo, cantos levemente
    arredondados, borda com detalhe sutil (pode usar rosa/dourado como cor de
    destaque, combinando com a identidade "Bell & Line" do site original).
22. `ui_dpad.png` + `ui_button_a.png` — controles touch em pixel art (fundo
    semitransparente, contraste alto pra usabilidade).
23. `ui_chatbubble.png` — bolhas de chat estilo WhatsApp em pixel (uma cor pra
    "ela", outra pra "eu"), usadas nas cenas de conversa por celular.
24. `icon_galo.png` / `icon_cruzeiro.png` — escudinhos estilizados (não precisa
    ser o escudo oficial, algo genérico preto/branco vs. azul já comunica).
25. `prop_soda_cans.png` — duas latinhas (uma vermelha genérica tipo cola, uma
    azul genérica tipo "outra marca") — piada do capítulo 3.
26. `prop_ringbox.png` — caixinha de anel aberta/fechada, capítulo final.
27. `fx_confetti_hearts.png` — folha de partículas (confete + corações) pra
    animações de celebração (twist do Galo e pedido).
28. `prop_envelope_letter.png` — envelope fechado e carta aberta (papel com
    linhas, sem precisar ser o texto legível em pixel — o texto real entra
    como HTML/texto por cima).
29. `logo_bellline.png` — logo pixelado "Bell & Line" pra tela de título,
    pode usar corações ou o mesmo "&" estilizado do site.
30. `map_pin_heart.png` — pin de coração pro mapa de viagem (item 18).

## 4. Prioridade de produção (se quiser ir por etapas)

Pra jogar algo funcional o quanto antes, essa é a ordem que eu sugiro:

1. `line_walk.png`, `bell_walk.png`, `bell_walk_galo.png` (itens 1, 5, 8) — sem
   isso não dá nem pra testar o movimento básico.
2. `line_portrait.png`, `bell_portrait.png` (itens 2, 6) — sem isso os diálogos
   ficam sem rosto.
3. `tileset_shopping.png` e `tileset_bh_overworld.png` (itens 14, 16) — os dois
   capítulos centrais do jogo.
4. Resto dos cenários e props, na ordem dos capítulos.
5. UI (itens 21–23) — pode usar um placeholder simples até o fim, não trava o
   resto do desenvolvimento.

Pode mandar aos poucos, capítulo por capítulo, que eu vou encaixando no jogo
conforme chegam — não precisa esperar ter tudo pronto.

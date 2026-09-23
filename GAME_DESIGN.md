# Bell & Line — Documento de Design do Jogo

Jogo em pixel art, para navegador mobile, contando a história real da Line (você)
e da Bell (sua namorada/noiva), baseado no site `meu-amor` (Happn, 01/05/2024, até
o pedido em 05/11/2025).

## 1. Conceito

Jogo de exploração 2D top-down (estilo Stardew Valley / Pokémon antigo), curto
(20–35 min de jogo), dividido em **capítulos jogáveis** que a jogadora percorre
andando pelo mapa, desbloqueando diálogos, memórias e mini-cenas. Sem combate,
sem game over — é uma jornada emocional, não um desafio de skill. Final: o pedido
de casamento e a carta.

**Título provisório:** *Bell & Line* (mesmo nome do site, mantém identidade).

**Engine sugerida:** Phaser 3 (JS puro, roda liso em navegador mobile, tem suporte
nativo a tilemap, sprites animados, e controles touch). Alternativa mais simples:
Kaplay/Kaboom.js, se você preferir algo mais leve — mas Phaser aguenta melhor
crescer o escopo depois.

**Controles:** D-pad virtual no canto inferior esquerdo (ou swipe) + botão de
ação "A" no canto direito para interagir/avançar diálogo. Layout retrato,
pensado pra celular.

## 2. Personagens

| Personagem | Papel | Observações de arte |
|---|---|---|
| **Line** | Personagem jogável | técnica em TI, sempre no compromisso do trabalho no início |
| **Bell** | Par romântico / NPC guia | técnica de enfermagem, 2 empregos; vira torcedora do Galo no cap. 3 |

Ambas precisam de sprite 4-direções (cima/baixo/esq/dir) + variação de retrato
para caixa de diálogo (neutro, sorrindo, rindo, surpresa, corada).

## 3. Estrutura — capítulos

Mapa geral é um **overworld estilizado de Belo Horizonte** (ruas simplificadas
conectando os pontos), a jogadora anda de cena em cena. Cada capítulo abaixo é
uma tela/mapa próprio, desbloqueada em sequência.

### Prólogo — "O Cruzamento" (não-jogável, cutscene curta)
Duas silhuetas pixel andando por ruas paralelas de BH, quase se cruzando várias
vezes sem perceber (referência direta ao Happn: "cruza o seu caminho"). Termina
com uma notificação de celular pixelada: **"oiii bom diaaaa"**.
> Texto do site: *"O Happn mostra quem cruza o seu caminho... sem saber."* (01/05/2024)

### Capítulo 1 — "Dois Julius"
Cena de diálogo por chat (caixas de mensagem estilo WhatsApp em pixel art),
alternando vinheta do trabalho da Line (TI) e da Bell (dois empregos, enfermagem).
Piada final: "Aline... É oficialmente o Julius" / "eu não tenho escapatória kkk".

### Capítulo 2 — "Galo × Cruzeiro" (mini-cena cômica)
Bell aparece de camisa do Cruzeiro (azul), Line reage ("tinha que ter algum
defeito nessa mulher"). Mini-interação: jogadora escolhe reagir. **Plot twist**
no final do capítulo: Bell troca de camisa para o Galo (preto e branco) —
animação de "revelação" com coração/confete. Precisa da foto real da Bell de
Galo (`fotos/galo.jpg`) como referência de arte, ou como imagem bônus na tela
de fim de capítulo.

### Capítulo 3 — "Minas Shopping" (09/05/2024 — primeiro encontro)
Primeira fase de exploração de verdade: top-down andando pela praça de
alimentação do shopping, encontrando a Bell entre as mesas ("a praça de
alimentação é grande né kk" / "eu tô te vendo kkkk"). Mini-piada jogável:
escolher um refrigerante (Coca vs. Pepsi — treta bobinha do site). Termina com
diálogo: *"Você SUPEROU TODAS AS MINHAS EXPECTATIVAS."*

### Capítulo 4 — "Gatinha do zoi verde" (transição curta)
Cena de apelidos carinhosos — corações flutuando, bolhas de chat trocando nome
do contato pra "neném"/"vida"/"xuxu". Serve de respiro entre capítulos maiores.

### Capítulo 5 — "A cidade toda, a pé" (19/05/2024)
Fase de exploração maior: mapa de BH com pontos de interesse colecionáveis —
Mineirão, Pampulha, Mercado Central, Savassi, Liberdade — andando de mãos dadas
(as duas sprites lado a lado). Cada ponto visitado dá uma linha de diálogo/memória.

### Capítulo 6 — "Sapucaí" (mesma noite, 19/05/2024)
Fase noturna, cenário do Viaduto Santa Tereza, céu estrelado. Vira "o lugar
delas". Fecha o arco do primeiro encontro.

### Interlúdio — "Linha do tempo" (mapa/calendário)
Tela de mapa de Minas Gerais + litoral + Rio de Janeiro, no estilo mapa de
viagem de jogo de RPG (estradinha pontilhada ligando as cidades), com pontos
clicáveis: Belo Horizonte, Contagem, Santa Luzia, Pedro Leopoldo, Matozinhos,
Lavras Novas, São Tomé das Letras, a estrada até Guarapari, e no Rio: Barra da
Tijuca, Centro/Museu do Amanhã, Queimados. Cada ponto abre uma legenda curta
(pode reaproveitar texto e fotos reais do site aqui, sem precisar virar pixel
art — mistura bem: mapa pixelado + foto real ao tocar no pin).

### Capítulo Final — "O Pedido" (05/11/2025)
Cena mais elaborada: cenário de ensaio fotográfico, Line tira o anel, animação
de ajoelhar, texto "ela disse sim", explosão de corações/confete em pixel art.
Pode usar a foto real do pedido (`pedido-16.jpg` já é usada como hero no site)
como imagem de fundo desfocada atrás da cena pixelada, ou como CG final.

### Epílogo — "A Carta"
Tela final: livro/envelope pixel art que abre e mostra o texto real da carta
do site (a carta emocionante, com trechos sobre os dias difíceis e o amor que
continua). Botão "tocar Sina" (a música already no repo `musica/sina.mp3`) toca
como trilha do encerramento. Créditos finais com corações e as duas sprites
sentadas olhando o "pôr do sol" pixelado.

### Bônus (pós-jogo, sempre acessível pelo menu)
- **Quiz "O quanto você me conhece"** — reaproveita as 5 perguntas do site.
- **"Tô com saudade"** — botão que dá uma mensagem fofa aleatória (banco de frases).
- **Álbum** — galeria com as fotos reais desbloqueadas por capítulo.

## 4. Lista de assets de pixel art necessários

Recomendo **32×32** para os personagens (dá detalhe suficiente pra expressões
e ainda roda bem em telas pequenas) e tiles de **16×16** ou **32×32** pro cenário
(mesma escala das sprites). Paleta de cores consistente entre todas as cenas.

### Personagens (prioridade alta)
1. **Line** — spritesheet de caminhada 4 direções (idle + 3–4 frames de passo por direção)
2. **Bell** — idem, spritesheet de caminhada 4 direções
3. **Bell — variante camisa Cruzeiro** (capítulo 2, antes do twist)
4. **Bell — variante camisa Galo** (capítulo 2, depois do twist, e daí em diante)
5. Retratos (bustos, ~64×64) de cada uma, expressões: neutro, sorrindo, rindo,
   surpresa, corada, apaixonada — usados na caixa de diálogo

### Cenários / tilesets
6. Rua genérica de cidade (para o prólogo e transições) — dia e noite
7. Praça de alimentação de shopping (mesas, balcão, letreiro de fast-food genérico)
8. Cenário "estádio"/arquibancada estilizada (capítulo Galo×Cruzeiro, pode ser simples)
9. BH overworld — versão estilizada com marcos: Mineirão, Lagoa da Pampulha,
   Mercado Central, prédios da Savassi, praça da Liberdade
10. Viaduto Santa Tereza / Sapucaí à noite, céu estrelado
11. Mapa-mundi estilo RPG de Minas Gerais + litoral + Rio de Janeiro (visão
    aérea estilizada, com estradinha pontilhada)
12. Cenário do pedido de casamento (jardim/estúdio fotográfico)
13. Fundo do epílogo (entardecer/anoitecer, as duas sentadas)

### UI / props
14. Moldura da caixa de diálogo (estilo pixel, cantos arredondados ou quadrados)
15. D-pad e botão de ação (touch controls) em pixel art
16. Balões de chat estilo WhatsApp (bolha "ela"/"eu") em pixel
17. Ícone de camisa Galo e Cruzeiro (pequenos, pra HUD/transição)
18. Latinha de refrigerante (Coca/Pepsi) — prop da piada do capítulo 3
19. Caixinha de anel, confete, partículas de coração
20. Envelope/carta fechada e aberta (epílogo)
21. Logo do jogo "Bell & Line" em pixel art (tela de título)
22. Pin de mapa em formato de coração (interlúdio de viagem)

### Áudio (você já tem)
- `musica/sina.mp3` (Ivyson – Sina) → trilha do epílogo/créditos
- Opcional: versão 8-bit/chiptune de "Sina" pra tocar durante o overworld, se
  quiser manter a estética pixel também no som (posso sugerir onde conseguir
  isso depois)

## 5. O que eu preciso de você agora
- Confirmar se topa **Phaser 3** como engine (recomendo) ou prefere algo mais simples
- Me mandar as artes conforme forem ficando prontas (nome de arquivo por
  capítulo já ajuda, ex: `line_walk.png`, `bell_walk_galo.png`, `shopping_tileset.png`)
- Me dizer se quer que eu já monte um **protótipo jogável com placeholders**
  (retângulos coloridos no lugar da arte final) pra você testar o fluxo no
  celular antes da arte ficar pronta — assim a gente valida o jogo antes de
  gastar tempo pixelando tudo

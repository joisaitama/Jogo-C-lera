# As Águas do Cólera — protótipo

Jogo de decisões em HTML/CSS/JS puro. Para jogar, abra `index.html` no navegador
(mantendo a pasta inteira junto — as imagens são carregadas por caminho relativo).

## Estrutura de pastas

```
asaguasdocolera/
├── index.html          → estrutura da página (não precisa mexer)
├── css/
│   └── estilos.css     → toda a aparência visual (cores, fontes, layout)
├── js/
│   ├── story.js         → TEXTO da história e referências de imagem
│   └── app.js            → motor do jogo (navegação, escolhas, diário de bordo)
└── img/
    ├── personagens/       → retratos definitivos (Catarina, marinheiro, dona, freira, padre)
    ├── cenarios/           → cenas ilustradas definitivas (porto, penteadeira)
    └── silhuetas/           → PLACEHOLDERS provisórios (silhuetas pretas simples)
```

## Como trocar uma ilustração provisória por uma definitiva

Todo lugar que ainda usa uma silhueta (`img/silhuetas/...`) está marcado no
canto da imagem com a etiqueta "ilustração provisória" — e o nome do
personagem/local aparece no `js/story.js`, no campo `scene` ou `portrait` de
cada trecho da história.

Passo a passo:
1. Produza a ilustração definitiva e salve em `img/personagens/` ou `img/cenarios/`
   (ex.: `mercado.jpeg`, `hospital.jpeg`, `homemelegante.jpeg`).
2. Abra `js/story.js` e, no topo do arquivo, no objeto `IMG`, aponte a chave
   correspondente para o novo arquivo. Por exemplo, para substituir a
   silhueta do "homem elegante":
   ```js
   silhHomemCartola: "img/personagens/homemelegante.jpeg",
   ```
3. Salve. Não precisa mexer em mais nada — a troca já aparece em todos os
   trechos que usam aquele personagem.

Se quiser parar de mostrar a etiqueta "ilustração provisória" para essa
imagem, é só remover a chave da lista `PLACEHOLDER_KEYS` no topo do
`js/story.js`.

## Onde crio uma cena ou local totalmente novo?

Adicione um novo nó dentro do objeto `story` em `js/story.js`, seguindo o
padrão dos que já existem (`chapter`, `text`, `choices` ou `continueTo`).
Se quiser um cartão de capítulo em tela preta antes desse trecho aparecer,
adicione:
```js
card: { kicker: "Capítulo X", title: "Título do capítulo" },
```

/* ============================================================
   AS ÁGUAS DO CÓLERA — dados da história
   Este arquivo só guarda TEXTO e REFERÊNCIAS DE IMAGEM.
   Para trocar uma ilustração, basta substituir o arquivo dentro
   de img/personagens, img/cenarios ou img/silhuetas mantendo o
   mesmo nome — não é preciso mexer no código.
   ============================================================ */

/* ---------- registro de imagens ---------- */
/* Reais (já produzidas) ficam em cenarios/ e personagens/.
   As chaves silh* e cenaGenerica são placeholders provisórios:
   silhuetas pretas simples, para os lugares/personagens que
   ainda não têm arte definitiva. Basta apontar a chave para o
   arquivo definitivo quando ele existir. */
const IMG = {
  catarina:        "img/personagens/Catarina.jpeg",
  marinheiro:       "img/personagens/marinheiro.jpeg",
  dona:            "img/personagens/donadoprostibulo.jpeg",
  freira:           "img/personagens/freiramandona.jpeg",
  padre:            "img/personagens/padre.jpeg",

  portoNoite:       "img/cenarios/portonocapitulomaisumanoite.jpeg",
  penteadeira:      "img/cenarios/penteadeiradacatarima.jpeg",
  portoDia:         "img/cenarios/porto1900.jpeg",

  /* placeholders (provisórios) */
  silhMulher:       "img/silhuetas/mulher_vestido.svg",
  silhHomemChapeu:  "img/silhuetas/homem_chapeu.svg",
  silhHomemCartola: "img/silhuetas/homem_cartola.svg",
  silhMenino:       "img/silhuetas/menino.svg",
  cenaGenerica:     "img/silhuetas/cena_generica.svg"
};

/* quais chaves de IMG são placeholders provisórios (mostram o aviso "ilustração provisória") */
const PLACEHOLDER_KEYS = new Set(["silhMulher","silhHomemChapeu","silhHomemCartola","silhMenino","cenaGenerica"]);

const PORTRAIT_NAME = {
  catarina: "Catarina",
  marinheiro: "O velho marinheiro",
  dona: "A dona do prostíbulo",
  freira: "A freira",
  padre: "O padre",
  silhMulher: "Mulher do mercado",
  silhHomemChapeu: "Antigo cliente",
  silhHomemCartola: "O homem elegante",
  silhMenino: "O menino mensageiro"
};

const SCENE_CAPTION = {
  portoNoite: "O porto ao entardecer",
  penteadeira: "O quarto de Catarina",
  portoDia: "O porto de Rio Grande"
};

const LOCATIONS = ["docas","mercado","hospital","igreja","residencial"];
const LOCATION_NAME = {
  docas: "Docas",
  mercado: "Mercado Público",
  hospital: "Hospital de Caridade",
  igreja: "Igreja Matriz",
  residencial: "Residencial Comercial"
};

/* ** NOVO ;;; MAPA LIVRE — hub de navegação entre os locais da cidade.
   Antes, os locais eram visitados numa ordem fixa (docas -> mercado ->
   hospital -> igreja -> residencial), sempre a mesma. Agora existe uma
   tela de mapa onde a jogadora escolhe pra onde ir, na ordem que quiser.
   Cada nó de local continua exatamente igual (texto, escolhas, "febril"
   etc.) — só o "continueTo" deles muda: em vez de encadear direto pro
   próximo local, eles voltam pra este hub (ver mudanças marcadas com
   ** ALTERADO ;;; nos nós a_docas, a_mercado_depois, a_hospital_*,
   a_igreja, a_res_*, s_docas_*, s_mercado_*, s_hospital_*, s_igreja,
   s_res_*, logo abaixo).
   Existem DOIS hubs porque a linha saudável (a_) e a linha febril (s_)
   usam nós diferentes para os mesmos lugares. */
const mapHubs = {
  a_map: {
    chapter: "O mapa da cidade",
    status: "saudável",
    scene: "portoDia",
    intro: "Agora Catarina pode se mover livremente pela cidade. Escolha para onde ir — cada lugar guarda um pedaço do mistério.",
    points: { docas:"a_docas", mercado:"a_mercado", hospital:"a_hospital", igreja:"a_igreja", residencial:"a_residencial" },
    next: "a_misterio"
  },
  s_map: {
    chapter: "O mapa da cidade",
    status: "febril",
    scene: "portoDia",
    intro: "Mesmo fraca, Catarina decide investigar antes que seja tarde demais. Escolha para onde ir.",
    points: { docas:"s_docas", mercado:"s_mercado", hospital:"s_hospital", igreja:"s_igreja", residencial:"s_residencial" },
    next: "s_misterio"
  }
};

const P = (...arr) => arr.map(t => `<p>${t}</p>`).join('');

/* ---------- prólogo em telas curtas ---------- */
const introSlides = [
  {
    scene: "portoDia",
    text: P("A cidade cresce ao redor do porto. Todos os dias chegam navios carregados de mercadorias, soldados, imigrantes e marinheiros.")
  },
  {
    scene: "portoDia",
    text: P(
      "Com eles chegam dinheiro e doenças.",
      "Nas ruas principais, comerciantes enriquecem. Nas vielas próximas às docas, mulheres vendem aquilo que a sociedade condena durante o dia e procura durante a noite."
    )
  },
  {
    scene: "portoDia",
    text: P(
      "Uma delas é Catarina, uma jovem prostituta de pouco mais de vinte anos. Ela trabalha em um prostíbulo localizado próximo ao porto, divide um pequeno quarto com outras mulheres e conhece quase todos os marinheiros que passam por Rio Grande.",
      "Os homens que entram em seu quarto contam histórias de outros países, guerras, tempestades e epidemias. Catarina aprende mais ouvindo clientes embriagados do que qualquer jornal poderia escrever.",
      "Naquela semana, porém, alguma coisa parecia diferente."
    )
  }
];

/* ---------- capítulos em telas curtas (mesmo estilo do prólogo) ---------- */
/* cada entrada tem: card de abertura (tela preta), uma lista de slides
   (imagem + texto + "Continuar") e "next": para onde ir depois do
   último slide — pode ser outro capítulo (chapters) ou um nó comum
   de story{} (ex.: o momento da escolha). */
const chapters = {

  ch1: {
    card: { kicker: "Capítulo 1", title: "Mais uma noite" },
    next: "ch2",
    slides: [
      { scene: "penteadeira", text: P("O sol desaparecia atrás dos mastros dos navios quando Catarina começou a se preparar para mais uma noite de trabalho.") },
      { scene: "penteadeira", text: P("Enquanto as outras mulheres riam alto, ela procurava entre seus pertences um delicado pente de madeira — a única lembrança que restava de sua mãe. Sentou-se diante de um pequeno espelho rachado e penteou os cabelos com algumas gotas de óleo.") },
      { scene: "penteadeira", text: P("Ao redor, as outras seguiam o mesmo ritual: algumas escondiam hematomas com pó de arroz, outras costuravam vestidos rasgados. Todas carregavam o mesmo olhar cansado.") },
      { scene: "penteadeira", text: P("Naquela noite chegara um navio vindo diretamente do Rio de Janeiro. Isso significava clientes. Clientes significavam dinheiro — dinheiro suficiente para não passar fome durante alguns dias.") },
      { scene: "penteadeira", text: P("Ela respirou fundo, ajeitou o vestido e desceu as escadas. Mal sabia que aquela seria a última noite em que sua vida pareceria comum.") }
    ]
  },

  ch2: {
    card: { kicker: "Capítulo 2", title: "O cliente" },
    next: "ch2_choice",
    slides: [
      { scene: "portoNoite", text: P("O salão do prostíbulo estava cheio: música, bebida, risadas. Marinheiros comemoravam o pagamento.", "Um deles, com aparência cansada, chamou Catarina e pagou adiantado. Os dois subiram para o quarto.") },
      { scene: "portoNoite", text: P("Assim que a porta se fechou, o homem permaneceu imóvel. Suas mãos tremiam.", "— Está tudo bem? — perguntou Catarina.") },
      { scene: "portoNoite", text: P("Ele tentou responder, levou a mão à boca e vomitou violentamente sobre o chão. Caiu de joelhos.", "— Água... pelo amor de Deus...", "Seu rosto estava completamente pálido, os olhos afundados. Pela primeira vez, Catarina sentiu medo de tocar em um cliente.") }
    ]
  }
};

/* ---------- nós da história ---------- */
const story = {

  ch2_choice: {
    chapter: "Capítulo 2 — O cliente",
    status: "saudável",
    scene: "portoNoite",
    text: P("Catarina precisa decidir agora."),
    choicePrompt: "O que Catarina faz?",
    choices: [
      { label: "Ajudar o homem", next: "s_intro" },
      { label: "Sair correndo para chamar a dona do prostíbulo", next: "a_dona" }
    ]
  },


  /* =================== LINHA DA DOENÇA =================== */

  s_intro: {
    chapter: "A decisão de Catarina", status: "febril", sick:true,
    text: P(
      "Catarina se ajoelha ao lado dele, tentando erguê-lo pelos ombros. Ele está gelado, apesar da febre que queima sob a pele.",
      "Infeliz em sua condição social e, apesar de tudo, com bondade no coração, Catarina acaba de se colocar em um trajeto de morte.",
      "Ao amanhecer, o homem já estava morto. Na manhã seguinte, boatos começam a circular pelas docas: uma doença desconhecida chegou à cidade."
    ),
    continueTo: "s_map", continueLabel: "Ir até o mapa da cidade" /* ** ALTERADO ;;; agora vai pro hub do mapa livre em vez de direto pras docas */
  },

  s_docas: {
    chapter: "As docas", status: "febril", sick:true, location:"docas",
    scene:"portoDia", portrait:"marinheiro",
    text: P(
      "O movimento já não é o mesmo. Muitos marinheiros evitam tocar uns nos outros, enquanto carregadores cochicham ao descarregar barris de um navio recém-chegado.",
      "Catarina se aproxima de um velho marinheiro, que a reconhece: — Você era a moça do 'Estrela do Sul', não era? — Sou eu.",
      "Antes que consiga continuar a conversa, uma forte dor atravessa seu abdômen. Ela leva discretamente a mão ao estômago. O marinheiro percebe. — Você está bem?"
    ),
    choicePrompt: "Como Catarina responde?",
    choices: [
      { label: "\u201CFoi só uma tontura.\u201D", next: "s_docas_tontura" },
      { label: "\u201CNão estou me sentindo bem.\u201D", next: "s_docas_confessa" }
    ]
  },

  s_docas_tontura: {
    chapter: "As docas", status: "febril, escondendo", sick:true, location:"docas",
    portrait:"marinheiro",
    text: P(
      "Catarina força um sorriso. — Trabalhei a noite toda. Estou cansada. O velho parece acreditar e continua falando:",
      "— Escute... não conte isso para ninguém. Metade da tripulação morreu antes de chegarmos. Os capitães escondem os corpos durante a viagem. Se descobrirem, mandam o navio de volta.",
      "Enquanto conversa, Catarina sente um suor frio escorrer pela nuca. Sua visão embaça por alguns segundos. Ela consegue sair das docas com uma informação importante — mas os sintomas aumentam."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mercado, agora volta pro mapa livre */
  },

  s_docas_confessa: {
    chapter: "As docas", status: "febril, exposta", sick:true, location:"docas",
    portrait:"marinheiro",
    text: P(
      "O marinheiro imediatamente recua. Seu semblante muda. — Há quanto tempo? — Desde ontem... Ele faz o sinal da cruz. — Vá embora. Agora.",
      "Outros homens escutam. Um deles grita: — Ela está doente! Os trabalhadores começam a se afastar. Ninguém mais aceita conversar.",
      "Catarina sai das docas sem descobrir quase nada. Mas percebe que o medo da doença consegue ser maior do que o preconceito que sempre sofreu. Enquanto se afasta, vê o homem elegante observando tudo."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mercado, agora volta pro mapa livre */
  },

  s_mercado: {
    chapter: "Mercado Público", status: "febril", sick:true, location:"mercado",
    scene:"cenaGenerica", sceneCaption:"Mercado Público", portrait:"silhMulher",
    text: P(
      "As ruas estão mais vazias. O cheiro de peixe mistura-se ao cheiro da cal usada para cobrir manchas deixadas pelos mortos.",
      "Enquanto anda entre as barracas, uma mulher a reconhece. — Aquela ali trabalha no prostíbulo! Outra completa: — Vive cercada de marinheiros! Deve estar espalhando essa doença!",
      "Nesse instante Catarina sente uma onda de náusea. Sua visão escurece."
    ),
    choicePrompt: "Como Catarina reage?",
    choices: [
      { label: "Responder", next: "s_mercado_responder" },
      { label: "Ir embora sem responder", next: "s_mercado_ignorar" }
    ]
  },

  s_mercado_responder: {
    chapter: "Mercado Público", status: "febril, isolada", sick:true, location:"mercado",
    text: P(
      "Ela encara a mulher. — Eu não trouxe doença nenhuma. Vocês procuram culpados porque têm medo. A multidão fica em silêncio. Um homem retruca: — Então por que está tão pálida? Outro aponta: — Olhem as mãos dela... estão tremendo.",
      "As pessoas começam a recuar. Mesmo defendendo sua honra, ela acaba sendo isolada.",
      "Ao ir embora, encontra um papel preso em uma caixa. Nele há apenas uma frase: 'Nem tudo o que dizem sobre a doença é verdade.' É a primeira pista da conspiração."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro hospital, agora volta pro mapa livre */
  },

  s_mercado_ignorar: {
    chapter: "Mercado Público", status: "piorando", sick:true, location:"mercado",
    text: P(
      "Ela prefere não discutir. Continua andando. Mas os passos ficam cada vez mais lentos. De repente, vomita atrás de uma barraca. Uma criança vê. — Mamãe... a moça está doente.",
      "Em poucos segundos todos se afastam. Um vendedor joga água no chão onde ela estava, como se tentasse apagar sua presença.",
      "Ela não encontra nenhuma pista importante. Mas entende que, se continuar piorando, logo ninguém permitirá que ela entre em lugar algum."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro hospital, agora volta pro mapa livre */
  },

  s_hospital: {
    chapter: "Hospital de Caridade", status: "piorando", sick:true, location:"hospital",
    scene:"cenaGenerica", sceneCaption:"Hospital de Caridade", portrait:"freira",
    text: P(
      "O hospital está muito pior do que ela imaginava. Gritos, gemidos, pessoas deitadas no chão. Médicos sem descansar.",
      "Uma freira se aproxima e olha diretamente para Catarina. — Minha filha... você está doente?"
    ),
    choicePrompt: "Como Catarina responde à freira?",
    choices: [
      { label: "Mentir", next: "s_hospital_mentir" },
      { label: "Contar a verdade", next: "s_hospital_verdade" }
    ]
  },

  s_hospital_mentir: {
    chapter: "Hospital de Caridade", status: "piorando, escondendo", sick:true, location:"hospital",
    portrait:"freira",
    text: P(
      "— Não. Só estou cansada. A freira segura delicadamente sua mão e percebe que está gelada. Mas decide fingir que acreditou. — Procure ir para casa.",
      "Enquanto caminha pelos corredores, Catarina escuta escondida dois médicos: — Não conseguimos mais contar os mortos. — Se fechassem o porto... — Não vão fechar.",
      "Ela consegue descobrir mais sobre a epidemia. Porém, ao sair, precisa apoiar-se na parede. Já mal consegue caminhar."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pra igreja, agora volta pro mapa livre */
  },

  s_hospital_verdade: {
    chapter: "Hospital de Caridade", status: "piorando, amparada", sick:true, location:"hospital",
    portrait:"freira",
    text: P(
      "Ela abaixa a cabeça. — Acho... acho que estou igual aos outros. A freira a conduz até um banco, traz água, senta ao lado dela. — Como começou? Catarina conta sobre o cliente.",
      "A freira fecha os olhos, respira fundo. — Então provavelmente você foi contaminada. Escute bem: o que vou dizer não pode sair daqui. Há gente importante escondendo a gravidade da doença. Querem evitar o pânico. Mas você precisa ir embora da cidade.",
      "É nesse momento que Catarina recebe a confirmação de que tudo aquilo era muito maior do que imaginava."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pra igreja, agora volta pro mapa livre */
  },

  s_igreja: {
    chapter: "Igreja Matriz", status: "grave", sick:true, location:"igreja",
    scene:"cenaGenerica", sceneCaption:"Igreja Matriz", portrait:"padre",
    text: P(
      "Mesmo doente, Catarina invade a igreja e escuta exatamente a mesma reunião de sempre. Porém sua condição piora.",
      "Enquanto ouve — 'Escondam os mortos...' — ela sente um gosto amargo na boca. Seu corpo perde as forças.",
      "Quando pisa na madeira, não consegue correr imediatamente. Quase é descoberta e precisa esconder-se atrás do altar. Enquanto os homens procuram, ela prende a respiração.",
      "Quando consegue fugir, cai de joelhos do lado de fora. Começa a vomitar novamente."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro residencial, agora volta pro mapa livre */
  },

  s_residencial: {
    chapter: "Residencial Comercial", status: "grave", sick:true, location:"residencial",
    scene:"cenaGenerica", sceneCaption:"Residencial Comercial", portrait:"silhHomemChapeu",
    text: P(
      "Seu antigo cliente está deitado, respirando com dificuldade. Quando vê Catarina, sorri tristemente. — Você também... Ela apenas confirma com a cabeça."
    ),
    choicePrompt: "O que Catarina faz?",
    choices: [
      { label: "Permanecer ao lado dele", next: "s_res_permanecer" },
      { label: "Ir embora", next: "s_res_embora" }
    ]
  },

  s_res_permanecer: {
    chapter: "Residencial Comercial", status: "grave", sick:true, location:"residencial",
    text: P(
      "Ela segura sua mão. Os dois permanecem em silêncio. Ele diz: — Passei minha vida viajando. Nunca tive medo do mar. Mas tenho medo de morrer mentindo.",
      "Antes de fechar os olhos, entrega um pequeno medalhão. Dentro há um papel: 'Se acontecer alguma coisa comigo, apenas confie na irmã Helena.'",
      "Antes de morrer, ele ainda sussurra: — Não confie... nos homens da igreja..."
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mistério, agora volta pro mapa livre até visitar tudo */
  },

  s_res_embora: {
    chapter: "Residencial Comercial", status: "grave, culpada", sick:true, location:"residencial",
    text: P(
      "Ela não suporta ver outro homem morrer e sai rapidamente. No corredor encontra uma jovem criada chorando. — O senhor pediu isso antes que você fosse embora. Ela entrega o mesmo medalhão.",
      "Catarina sente culpa. Durante os dias seguintes, um pensamento volta sempre: 'Será que ele morreu sozinho?'"
    ),
    continueTo: "s_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mistério, agora volta pro mapa livre até visitar tudo */
  },

  s_misterio: {
    chapter: "O homem elegante", status: "grave", sick:true, portrait:"silhHomemCartola",
    text: P(
      "Mesmo doente, Catarina continua percebendo o homem elegante. Só que agora ela já não sabe distinguir realidade de delírio.",
      "Às vezes ele parece observá-la. Às vezes desaparece. O jogador começa a duvidar da própria percepção."
    ),
    continueTo: "s_meio", continueLabel: "Continuar"
  },

  s_meio: {
    chapter: "Meio da história", status: "grave, piorando", sick:true,
    text: P(
      "Agora a epidemia deixa de ser apenas o cenário. Ela acontece dentro de Catarina.",
      "Primeiro, cansaço. Depois, cólicas, vômitos, fraqueza, dificuldade para caminhar. A pele torna-se pálida, os olhos afundam, ela emagrece rapidamente. Até subir uma escada passa a ser um esforço enorme."
    ),
    continueTo: "s_final_setup", continueLabel: "Continuar"
  },

  s_final_setup: {
    chapter: "Capítulo final", status: "grave", sick:true, portrait:"freira",
    card: { kicker: "Capítulo final", title: "A verdade" },
    text: P(
      "A freira do Hospital de Caridade consegue encontrá-la no prostíbulo abandonado. É noite. Catarina está deitada, quase sem forças para se levantar. A freira senta ao lado da cama. Pela primeira vez, alguém resolve contar a verdade.",
      "— Catarina... a cidade está mentindo. Dizem que é apenas uma febre. Não é. É uma epidemia. Veio pelos navios. Os comerciantes não querem fechar o porto — há medo de perder dinheiro, medo do pânico. Mas o que mais me assusta é o silêncio.",
      "Catarina pergunta baixinho: — Então... vou morrer? A freira demora alguns segundos para responder. — Eu não sei. Mas você merece saber a verdade."
    ),
    choicePrompt: "Escolha final",
    choices: [
      { label: "Sair sozinha, rumo ao mar", next: "final_mar" },
      { label: "Ficar e deixar que cuidem dela", next: "final_ultimos" }
    ]
  },

  final_mar: {
    chapter: "Final 3 — O Mar", status:"fim", sick:true, ending:true, portrait:"catarina",
    scene:"cenaGenerica", sceneCaption:"O cais, ao amanhecer",
    text: P(
      "Depois da conversa, Catarina compreende que dificilmente sobreviverá. Sai durante a madrugada e caminha lentamente até o cais. Observa o mar — o mesmo mar que trouxe dinheiro, clientes e a doença.",
      "Segura o pente de madeira da mãe pela última vez e olha para o horizonte. Deixa o pente sobre o cais, dá mais alguns passos e desaparece nas águas escuras da madrugada.",
      "Dias depois, alguns pescadores comentam ter encontrado um vestido boiando. Nunca identificam o corpo."
    ),
    quote: "O mar que trouxe a cólera também levou Catarina. Seu nome dissolveu-se nas mesmas águas que mudaram a história de Rio Grande."
  },

  final_ultimos: {
    chapter: "Final 4 — Últimos Instantes", status:"fim", sick:true, ending:true, portrait:"dona",
    scene:"cenaGenerica", sceneCaption:"O prostíbulo abandonado",
    text: P(
      "Após a visita da freira, Catarina já não consegue ficar de pé. A dona do prostíbulo — a mesma mulher dura que sempre pensou primeiro no dinheiro — decide permanecer ao seu lado.",
      "Uma das outras prostitutas pergunta por quê. A dona responde: — Porque ninguém merece morrer sozinho. Ela passa a noite inteira trocando panos úmidos e tentando aliviar o sofrimento de Catarina.",
      "Entre um momento de lucidez e outro, Catarina pergunta: — Então... eles sabiam? A freira responde: — Alguns sabiam. Alguns preferiram o silêncio. Outros tentaram ajudar. Mas já era tarde.",
      "Ao amanhecer, Catarina segura o pente de madeira contra o peito. Fecha os olhos. Sua respiração torna-se lenta, até parar. A dona cobre seu corpo com um lençol e, pela primeira vez em muitos anos, chora."
    ),
    quote: "Em vida, Catarina foi vista apenas como uma prostituta. Em seus últimos momentos, encontrou aquilo que lhe faltara por tantos anos: alguém que permanecesse ao seu lado até o fim."
  },

  /* =================== LINHA DA CONSPIRAÇÃO =================== */

  a_dona: {
    chapter: "A dona do prostíbulo", status: "saudável, atenta", portrait:"dona",
    text: P(
      "Catarina recua e corre para o corredor, gritando por ajuda. Ao achar a dona do prostíbulo, explica a situação. O médico é chamado.",
      "Ao amanhecer, o homem já estava morto. Na manhã seguinte, boatos começam a circular pelas docas: uma doença desconhecida chegou à cidade.",
      "A dona reúne todas as mulheres, fecha portas e janelas e olha uma por uma. — Escutem bem. Ninguém comenta o que aconteceu aqui. Uma das prostitutas pergunta: — E se perguntarem? — Digam que ele estava bêbado. — Mas ele... — Eu disse que estava bêbado!",
      "Silêncio. Então ela conclui: — Se a cidade acreditar que essa doença entrou nesta casa, estaremos todas na rua antes mesmo da doença nos matar.",
      "Naquele momento, Catarina percebe que sua sobrevivência depende daquele lugar."
    ),
    continueTo: "a_map", continueLabel: "Continuar" /* ** ALTERADO ;;; agora vai direto pro hub do mapa livre, em vez do antigo a_map_intro */
  },

  /* ** REMOVIDO ;;; "a_map_intro" não existe mais — o mapa livre agora é
     um hub próprio (mapHubs.a_map, definido logo abaixo da lista LOCATIONS),
     que deixa a jogadora escolher a ordem dos lugares em vez de seguir
     um roteiro fixo (docas -> mercado -> hospital -> igreja -> residencial). */

  a_docas: {
    chapter: "As docas", status: "saudável", location:"docas",
    scene:"portoDia", portrait:"marinheiro",
    text: P(
      "As docas continuam movimentadas, mas o clima mudou. Marinheiros cochicham, carregadores evitam alguns navios.",
      "Um velho marinheiro comenta: — Nunca vi tantos homens adoecerem numa única viagem. Outro responde: — Metade da tripulação morreu antes de chegarmos. Um carregador completa: — Alguns capitães esconderam doentes dentro dos porões para evitar quarentena.",
      "Catarina percebe que a doença provavelmente veio pelo mar. Ao deixar as docas, sente alguém observando. Quando olha para trás, não há ninguém."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mercado, agora volta pro mapa livre */
  },

  a_mercado: {
    chapter: "Mercado Público", status: "saudável", location:"mercado",
    scene:"cenaGenerica", sceneCaption:"Mercado Público", portrait:"silhMulher",
    text: P(
      "O mercado ainda funciona, mas há menos pessoas. Os preços aumentaram, algumas bancas fecharam. Carroças transportam corpos cobertos por panos.",
      "Enquanto passa entre os vendedores, uma mulher a reconhece. — Aquela ali trabalha no prostíbulo! — Vive com marinheiros! — Deve estar espalhando essa doença!"
    ),
    choicePrompt: "Como Catarina reage?",
    choices: [
      { label: "Responder", next: "a_mercado_depois" },
      { label: "Ignorar", next: "a_mercado_depois" },
      { label: "Fugir", next: "a_mercado_depois" }
    ]
  },

  a_mercado_depois: {
    chapter: "Mercado Público", status: "saudável, observada", location:"mercado",
    portrait:"silhHomemCartola",
    text: P(
      "Seja qual for a atitude, os sussurros a seguem pelas ruas. Mais tarde, ela percebe novamente o mesmo homem elegante parado do outro lado da rua. Quando tenta se aproximar, ele desaparece entre a multidão."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro hospital, agora volta pro mapa livre */
  },

  a_hospital: {
    chapter: "Hospital de Caridade", status: "saudável", location:"hospital",
    scene:"cenaGenerica", sceneCaption:"Hospital de Caridade", portrait:"freira",
    text: P(
      "Os corredores estão lotados. Doentes ocupam até o chão, médicos caminham apressados, freiras distribuem água aos enfermos.",
      "Catarina entra fingindo procurar um cliente desaparecido. Uma freira a interrompe. — Você é parente de alguém?"
    ),
    choicePrompt: "Como Catarina responde?",
    choices: [
      { label: "Mentir", next: "a_hospital_mentir" },
      { label: "Dizer a verdade", next: "a_hospital_verdade" }
    ]
  },

  a_hospital_mentir: {
    chapter: "Hospital de Caridade", status: "saudável", location:"hospital",
    portrait:"freira",
    text: P(
      "Catarina diz que o rapaz é seu irmão. A freira, ocupada demais para desconfiar, a deixa passar.",
      "Ela escuta dois médicos conversando: — Os primeiros casos vieram dos navios. — Se continuarem chegando embarcações, perderemos a cidade inteira.",
      "Ao sair do hospital, ela vê novamente o homem elegante. Ele apenas observa. Depois vai embora."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pra igreja, agora volta pro mapa livre */
  },

  a_hospital_verdade: {
    chapter: "Hospital de Caridade", status: "saudável", location:"hospital",
    portrait:"freira",
    text: P(
      "Catarina admite que não conhece ninguém ali. A freira balança a cabeça e a conduz gentilmente até a porta.",
      "Ao sair do hospital, ela vê novamente o homem elegante. Ele apenas observa. Depois vai embora."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pra igreja, agora volta pro mapa livre */
  },

  a_igreja: {
    chapter: "Igreja Matriz", status: "saudável, em perigo", location:"igreja",
    scene:"cenaGenerica", sceneCaption:"Igreja Matriz", portrait:"padre",
    text: P(
      "Durante o dia, Catarina sabe que seria expulsa. Então volta durante a madrugada, entra por uma pequena janela lateral e se esconde atrás dos bancos.",
      "Pouco depois, uma reunião começa: padre, comerciantes, autoridades. Um comerciante diz: — Não podemos fechar o porto. Outro responde: — Se espalharmos o tamanho dessa doença, nenhum navio atracará aqui. A cidade quebra.",
      "Um homem desconhecido fala calmamente: — Então escondam os mortos. Digam que foi febre. Digam qualquer coisa. O padre permanece em silêncio. Depois responde: — Quanto menos pessoas souberem... melhor.",
      "Nesse instante, uma tábua estala sob os pés de Catarina. Silêncio. — Tem alguém aí? Catarina rapidamente foge e desaparece na escuridão — não antes de ouvir passos por perto."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro residencial, agora volta pro mapa livre */
  },

  a_residencial: {
    chapter: "Residencial Comercial", status: "saudável", location:"residencial",
    scene:"cenaGenerica", sceneCaption:"Residencial Comercial", portrait:"silhHomemChapeu",
    text: P(
      "Ali vivem comerciantes ricos e viajantes. Catarina entra fingindo procurar um cliente, mas na verdade quer ouvir conversas. Descobre que famílias inteiras estão deixando Rio Grande.",
      "Também encontra um antigo cliente — um dos poucos homens que sempre a tratou com respeito. Agora está gravemente doente. Ele segura sua mão. — Não me deixe morrer sozinho..."
    ),
    choicePrompt: "O que Catarina faz?",
    choices: [
      { label: "Permanecer ao lado dele", next: "a_res_permanecer" },
      { label: "Ir embora", next: "a_res_embora" }
    ]
  },

  a_res_permanecer: {
    chapter: "Residencial Comercial", status: "saudável", location:"residencial",
    text: P(
      "Catarina fica ao lado da cama, segurando sua mão até a respiração dele ficar mais fraca. Antes de morrer, ele sussurra: — Não confie... nos homens da igreja..."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mistério, agora volta pro mapa livre até visitar tudo */
  },

  a_res_embora: {
    chapter: "Residencial Comercial", status: "saudável, exausta", location:"residencial",
    text: P(
      "Catarina solta a mão dele e sai do quarto sem olhar para trás. Ela já viu gente demais morrer esta semana — não pode carregar mais um rosto. Ele tenta dizer algo, mas ela já fechou a porta."
    ),
    continueTo: "a_map", continueLabel: "Voltar ao mapa" /* ** ALTERADO ;;; antes ia direto pro mistério, agora volta pro mapa livre até visitar tudo */
  },

  a_misterio: {
    chapter: "O homem elegante", status: "saudável", portrait:"silhHomemCartola",
    text: P(
      "Depois que começou a investigação, Catarina percebe que alguém conhece seus passos. Sempre que descobre algo importante, o homem elegante aparece.",
      "Nunca fala. Nunca sorri. Nunca diz seu nome. Conversa discretamente com o padre, com comerciantes, com soldados."
    ),
    continueTo: "a_meio", continueLabel: "Continuar"
  },

  a_meio: {
    chapter: "Meio da história", status: "saudável, na cidade em colapso",
    text: P(
      "A epidemia explode. Os sinos da Igreja Matriz tocam quase sem parar. Carroças recolhem corpos pelas ruas. O Hospital de Caridade entra em colapso. O Mercado Público esvazia. As docas tornam-se silenciosas.",
      "O prostíbulo fecha. Sem clientes, sem dinheiro, sem esperança. Algumas prostitutas fogem, outras morrem de fome. A dona expulsa todas. Catarina fica completamente sozinha.",
      "Agora o objetivo deixa de ser trabalhar. Passa a ser sobreviver."
    ),
    continueTo: "a_final_setup", continueLabel: "Continuar"
  },

  a_final_setup: {
    chapter: "Capítulo final", status: "saudável, sozinha", portrait:"silhMenino",
    card: { kicker: "Capítulo final", title: "O bilhete" },
    text: P(
      "Dias depois, um menino se aproxima de Catarina. — Moça... um senhor pediu para entregar isso. Ele lhe entrega um pequeno papel: 'Descobri de onde veio a doença. Encontre-me sozinho no beco atrás do Mercado Público. Não conte a ninguém.'",
      "Catarina observa ao redor. O menino já desapareceu."
    ),
    choicePrompt: "Escolha final",
    choices: [
      { label: "Ir ao encontro", next: "final_beco" },
      { label: "Ignorar o bilhete e fugir da cidade", next: "final_posseira" }
    ]
  },

  final_posseira: {
    chapter: "Final 1 — A Posseira", status:"fim", ending:true, portrait:"catarina",
    scene:"cenaGenerica", sceneCaption:"O interior, longe da cidade",
    text: P(
      "Catarina amassa o bilhete. Lembra que vem sendo seguida desde a noite em que entrou na igreja. Na mesma madrugada, aceita a carona de um tropeiro rumo ao interior.",
      "Longe de Rio Grande, ocupa um pequeno pedaço de terra abandonada. Constrói um rancho, aprende a plantar, vive com pouco — mas finalmente sem depender de homens que a desprezavam durante o dia e procuravam sua cama durante a noite."
    ),
    quote: "Ela escapou da cólera e das sombras da cidade. O preconceito nunca desapareceu, mas, pela primeira vez, sua vida lhe pertencia."
  },

  final_beco: {
    chapter: "Final 2 — O Beco", status:"fim", ending:true, portrait:"silhHomemCartola",
    scene:"cenaGenerica", sceneCaption:"O beco, atrás do mercado",
    text: P(
      "Catarina decide seguir o bilhete. O beco atrás do Mercado Público está vazio. Apenas uma lamparina ilumina a noite. Ela espera. Passos ecoam.",
      "Um homem bem vestido surge da escuridão — o mesmo que a observava desde a invasão da igreja. — Catarina? Ela recua. — Quem é você? Ele sorri discretamente. — Alguém que protege os interesses desta cidade. Você ouviu coisas que jamais deveria ouvir.",
      "— Eu só queria entender o que estava acontecendo... Outro homem aparece atrás dela, bloqueando a saída do beco. — E agora entende demais.",
      "Ela tenta correr. É derrubada. A luta acontece fora da visão do jogador. A tela escurece. Ouvem-se apenas passos se afastando. Silêncio.",
      "Dias depois, carroças continuam cruzando a cidade. Ninguém entra naquele beco. Ninguém procura Catarina. Seu corpo permanece ali, esquecido entre o lixo e a umidade. A epidemia continua. O porto continua funcionando. E a cidade segue como se ela nunca tivesse existido."
    ),
    quote: "A cólera matou centenas. Catarina morreu pelas mãos daqueles que temiam mais a verdade do que a doença. Seu nome desapareceu antes mesmo de seu corpo."
  }
};
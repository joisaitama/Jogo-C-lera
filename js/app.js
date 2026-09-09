/* ============================================================
   AS ÁGUAS DO CÓLERA — motor do jogo
   Depende de story.js (deve ser carregado antes deste arquivo)

   Estilo único "cena": toda tela (prólogo, capítulos, escolhas,
   finais, créditos) usa a mesma estrutura visual — imagem em
   cima, rodapé escuro com o texto embaixo — para manter a
   mesma vibe do início ao fim.
   ============================================================ */

const bodyEl = document.getElementById('body');
const bookEl = document.getElementById('book');
const logListEl = document.getElementById('logList');
const logEl = document.getElementById('log');
const logTabEl = document.getElementById('logTab');

logTabEl.addEventListener('click', () => {
  const isOpen = logEl.classList.toggle('open');
  logTabEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

let logEntries = [];
let visitedLocations = new Set();
let introIndex = 0;

/* ---------- utilidades ---------- */

function imgTag(key, alt){
  return `<img src="${IMG[key]}" alt="${alt}">`;
}

function resolveHero(node){
  const key = node.scene || "cenaGenerica";
  const caption = node.sceneCaption || SCENE_CAPTION[key] || node.chapter || "";
  return { key, caption };
}

function heroHTML(node){
  const { key, caption } = resolveHero(node);
  const isPlaceholder = PLACEHOLDER_KEYS.has(key);
  const cls = 'cine-hero' + (isPlaceholder ? ' is-placeholder' : '');
  let html = `<div class="${cls}">${imgTag(key, caption)}`;
  /* ** ALTERADO ;;; o personagem agora aparece DENTRO do próprio cenário
     (de corpo inteiro, "em pé" na cena), em vez de um retrato circular
     separado flutuando no texto — ver characterOnStageHTML() abaixo e
     a classe .stage-character no CSS. */
  if(node.portrait){
    html += characterOnStageHTML(node.portrait);
  }
  html += `</div>`;
  return html;
}

function characterOnStageHTML(portraitKey){
  const isPlaceholder = PLACEHOLDER_KEYS.has(portraitKey);
  const cls = 'stage-character' + (isPlaceholder ? ' is-placeholder' : '');
  return `
    <div class="${cls}">
      <img src="${IMG[portraitKey]}" alt="${PORTRAIT_NAME[portraitKey]}, presente na cena">
      <span class="stage-character-name">${PORTRAIT_NAME[portraitKey]}</span>
      ${isPlaceholder ? '<span class="stage-character-flag">provisório</span>' : ''}
    </div>
  `;
}

const SICK_SEVERITY_STAGES = [
  "febril",              // 0 locais visitados
  "febril, piorando",    // 1
  "piorando",            // 2
  "piorando, grave",     // 3
  "grave",               // 4
  "grave"                // 5 (todos visitados)
];

function sickSeverity(){
  const idx = Math.min(visitedLocations.size, SICK_SEVERITY_STAGES.length - 1);
  return SICK_SEVERITY_STAGES[idx];
}

function displayStatus(node){
  if(!node.sick || node.ending) return node.status;
  const parts = (node.status || "").split(",");
  const flavor = parts.length > 1 ? parts.slice(1).join(",").trim() : null;
  const severity = sickSeverity();
  return flavor ? `${severity}, ${flavor}` : severity;
}

function progressRowHTML(){
  const pct = Math.round(visitedLocations.size / LOCATIONS.length * 100);
  return `
    <div class="cine-progress-row">
      <span class="progress-label">Espaços visitados: ${visitedLocations.size}/${LOCATIONS.length}</span>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function scrollTop(){
  bookEl.scrollIntoView({behavior:'smooth', block:'start'});
}

function addLog(chapter, choiceLabel){
  logEntries.push({chapter, choiceLabel});
  renderLog();
}

function renderLog(){
  if(logEntries.length === 0){
    logListEl.innerHTML = '<li class="log-empty" style="border:none; padding-left:0; animation:none; opacity:1;">Suas escolhas aparecerão aqui.</li>';
    return;
  }
  logListEl.innerHTML = '';
  logEntries.forEach((entry, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = (i * 0.05) + 's';
    li.innerHTML = `<strong>${entry.chapter}</strong><br>${entry.choiceLabel}`;
    logListEl.appendChild(li);
  });
}

/* ---------- telas especiais ---------- */

function renderTitle(){
  bodyEl.classList.remove('sick');
  logEl.style.display = 'none';
  bookEl.classList.add('fullbleed');
  bookEl.innerHTML = `
    <div class="title-screen">
      <div class="hero">${imgTag('portoNoite', 'O porto de Rio Grande ao entardecer, navios ancorados sob um céu vermelho')}</div>
      <div class="title-copy">
        <h1>As Águas do Cólera</h1>
        <div class="subtitle">Uma perspectiva infame da humanidade</div>
        <button class="start-btn" id="startBtn">Começar</button>
        <div class="place-tag">Rio Grande — 1855</div>
      </div>
    </div>
  `;
  document.getElementById('startBtn').onclick = () => {
    introIndex = 0;
    renderIntroSlide();
  };
}

function renderIntroSlide(){
  bodyEl.classList.remove('sick');
  logEl.style.display = 'none';
  bookEl.classList.add('fullbleed');
  const slide = introSlides[introIndex];
  const isLast = introIndex === introSlides.length - 1;

  bookEl.innerHTML = `
    <div class="cine-screen">
      <div class="cine-hero">${imgTag(slide.scene, 'Cena do porto de Rio Grande')}</div>
      <div class="cine-footer">
        <div class="cine-kicker-row"><span class="cine-kicker">Prólogo — ${introIndex + 1}/${introSlides.length}</span></div>
        <div class="cine-text">${slide.text}</div>
        <button class="start-btn" id="introContinue">Continuar</button>
      </div>
    </div>
  `;
  document.getElementById('introContinue').onclick = () => {
    if(!isLast){
      introIndex++;
      renderIntroSlide();
    } else {
      goTo('ch1');
    }
    scrollTop();
  };
}

function renderChapterCard(card, onContinue){
  bodyEl.classList.remove('sick');
  logEl.style.display = 'none';
  bookEl.classList.add('fullbleed');
  bookEl.innerHTML = `
    <div class="chapter-card" id="chapterCard">
      <div class="kicker-card">${card.kicker}</div>
      <h2>${card.title}</h2>
      <div class="card-hint">Clique para continuar</div>
    </div>
  `;
  document.getElementById('chapterCard').onclick = () => {
    onContinue();
    scrollTop();
  };
}

/* renderiza um slide de um capítulo (mesmo layout do prólogo) */
function renderChapterSlide(chapterKey, idx){
  bodyEl.classList.remove('sick');
  logEl.style.display = 'none';
  bookEl.classList.add('fullbleed');
  const conf = chapters[chapterKey];
  const slide = conf.slides[idx];
  const isLast = idx === conf.slides.length - 1;

  bookEl.innerHTML = `
    <div class="cine-screen">
      <div class="cine-hero">${imgTag(slide.scene, 'Cena de ' + conf.card.title)}</div>
      <div class="cine-footer">
        <div class="cine-kicker-row"><span class="cine-kicker">${conf.card.kicker} — ${idx + 1}/${conf.slides.length}</span></div>
        <div class="cine-text">${slide.text}</div>
        <button class="start-btn" id="chapterSlideContinue">Continuar</button>
      </div>
    </div>
  `;
  document.getElementById('chapterSlideContinue').onclick = () => {
    if(!isLast){
      renderChapterSlide(chapterKey, idx + 1);
    } else {
      goTo(conf.next);
    }
    scrollTop();
  };
}

function renderCredits(){
  bodyEl.classList.remove('sick');
  logEl.style.display = 'none';
  bookEl.classList.add('fullbleed');
  bookEl.innerHTML = `
    <div class="cine-screen">
      <div class="cine-hero">${imgTag('portoNoite', 'O porto de Rio Grande, à noite')}</div>
      <div class="cine-footer">
        <div class="credits-screen">
          <h2>As Águas do Cólera</h2>
          <div class="credits-sub">Créditos</div>
          <ul class="credits-list">
            <li><span class="role">Projeto</span><span class="name">Bolsa História do Terror</span></li>
            <li><span class="role">Narrativa</span><span class="name">Joice Pedroso</span></li>
            <li><span class="role">Ilustração dos personagens</span><span class="name">Nicole Paráboa</span></li>
            <li><span class="role">Desenvolvimento do jogo</span><span class="name">Maria eduarda Corrêa</span></li>
            <li><span class="role">Orientação</span><span class="name">André Luiz Corrêa</span></li>
          </ul>
          <div class="center-row">
            <button class="start-btn" id="restartBtn">Jogar novamente</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('restartBtn').onclick = () => {
    logEntries = [];
    visitedLocations = new Set();
    renderLog();
    logEl.style.display = '';
    renderTitle();
  };
}

/* ---------- navegação entre nós ---------- */

function goTo(id){
  if(mapHubs[id]){ 
    renderMapHub(id);
    return;
  }
  if(chapters[id]){
    renderChapterCard(chapters[id].card, () => renderChapterSlide(id, 0));
    return;
  }
  const node = story[id];
  if(node && node.card){
    renderChapterCard(node.card, () => render(id));
  } else {
    render(id);
  }
}

function renderMapHub(id){
  const hub = mapHubs[id];
  bodyEl.classList.toggle('sick', id === 's_map');
  bookEl.classList.add('fullbleed');
  logEl.style.display = '';

  const allDone = LOCATIONS.every(loc => visitedLocations.has(loc));

  let html = `<div class="cine-screen">`;
  html += `<div class="cine-hero">${imgTag(hub.scene, 'O mapa da cidade')}</div>`;
  html += `<div class="cine-footer">`;
  html += `
    <div class="cine-kicker-row">
      <span class="cine-kicker">${hub.chapter}</span>
      <span class="cine-status">Estado: ${id === 's_map' ? sickSeverity() : hub.status}</span>
    </div>
  `;
  html += progressRowHTML();
  html += `<div class="cine-text"><p>${hub.intro}</p></div>`;

  html += `<div class="map-grid">`;
  LOCATIONS.forEach(loc => {
    const visited = visitedLocations.has(loc);
    html += `
      <button type="button" class="map-card${visited ? ' visited' : ''}" data-loc="${loc}" ${visited ? 'disabled' : ''}>
        <span class="map-card-name">${LOCATION_NAME[loc]}</span>
        <span class="map-card-tag">${visited ? 'visitado' : 'explorar'}</span>
      </button>
    `;
  });
  html += `</div>`;

  if(allDone){
    html += `<button class="start-btn continue-solo" id="mapContinueBtn">Seguir em frente na história</button>`;
  }

  html += `</div></div>`; // cine-footer, cine-screen
  bookEl.innerHTML = html;

  bookEl.querySelectorAll('.map-card:not(.visited)').forEach(btn => {
    btn.onclick = () => {
      goTo(hub.points[btn.dataset.loc]);
      scrollTop();
    };
  });

  if(allDone){
    document.getElementById('mapContinueBtn').onclick = () => {
      goTo(hub.next);
      scrollTop();
    };
  }
}

function render(id){
  const node = story[id];

  if(node.location) visitedLocations.add(node.location);

  bodyEl.classList.toggle('sick', !!node.sick);
  bookEl.classList.add('fullbleed');
  logEl.style.display = '';

  let html = `<div class="cine-screen">`;
  html += heroHTML(node);
  html += `<div class="cine-footer">`;

  html += `
    <div class="cine-kicker-row">
      <span class="cine-kicker">${node.chapter}</span>
      <span class="cine-status">Estado: ${displayStatus(node)}</span>
    </div>
  `;
  html += progressRowHTML();

  html += `<div class="cine-body">`;
  html += `<div class="cine-text">${node.text}</div>`;
  html += `</div>`; // cine-body

  if(node.quote){
    html += `<div class="cine-quote">${node.quote}</div>`;
  }

  if(node.ending){
    html += `<div class="cine-ending-tag">${node.chapter}</div>`;
    html += `<button class="start-btn continue-solo" id="creditsBtn">Ver créditos</button>`;
  } else if(node.choices){
    html += `<div class="cine-choices">`;
    if(node.choicePrompt){
      html += `<div class="prompt">${node.choicePrompt}</div>`;
    }
    node.choices.forEach((choice, i) => {
      html += `<button class="cine-choice-btn" data-choice-index="${i}">${choice.label}</button>`;
    });
    html += `</div>`;
  } else if(node.continueTo){
    html += `<button class="start-btn continue-solo" id="continueBtn">${node.continueLabel || 'Continuar'}</button>`;
  }

  html += `</div></div>`; // cine-footer, cine-screen

  bookEl.innerHTML = html;

  if(node.ending){
    document.getElementById('creditsBtn').onclick = () => renderCredits();
  } else if(node.choices){
    node.choices.forEach((choice, i) => {
      const btn = bookEl.querySelector(`[data-choice-index="${i}"]`);
      btn.onclick = () => {
        addLog(node.chapter, choice.label);
        goTo(choice.next);
        scrollTop();
      };
    });
  } else if(node.continueTo){
    document.getElementById('continueBtn').onclick = () => {
      goTo(node.continueTo);
      scrollTop();
    };
  }
}

/* ---------- inicialização ---------- */
renderLog();
renderTitle();

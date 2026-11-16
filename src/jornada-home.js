'use strict';

/* ---------- WhatsApp: só abre a conversa; quem envia é a pessoa ---------- */
const WA_PHONE = '5516996008849';
const WA_TEXT = 'Olá! Vim pelo site da CareFit e quero conversar sobre o meu momento.';
const WA_URL = 'https://api.whatsapp.com/send?phone=' + WA_PHONE + '&text=' + encodeURIComponent(WA_TEXT);
document.querySelectorAll('[data-wa]').forEach(a => { a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener noreferrer'; });

/* ---------- Preferência de movimento ---------- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function applyMotion() { document.body.classList.toggle('reduce-motion', reduced.matches); }
reduced.addEventListener('change', applyMotion); applyMotion();

/* ---------- Barra de leitura ---------- */
let queued = false;
function progress() {
  const d = document.documentElement;
  document.querySelector('.reading').style.transform = 'scaleX(' + (d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)) + ')';
  queued = false;
}
window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(progress); } }, { passive: true });
progress();

/* ---------- Hero: o texto em movimento é textura; controle de pausa ---------- */
const shoeHero = document.querySelector('.shoe-hero');
const motionButton = document.querySelector('#motion-toggle');
let manuallyPaused = false;
function syncHeroMotion() {
  const stop = manuallyPaused || reduced.matches || document.hidden;
  shoeHero.classList.toggle('is-paused', stop);
  motionButton.disabled = reduced.matches;
  motionButton.setAttribute('aria-pressed', String(stop));
  motionButton.setAttribute('aria-label', reduced.matches ? 'Movimento reduzido ativado' : stop ? 'Retomar texto em movimento' : 'Pausar texto em movimento');
  motionButton.innerHTML = reduced.matches ? '— <span>Movimento reduzido</span>' : stop ? '▶ <span>Retomar movimento</span>' : 'Ⅱ <span>Pausar movimento</span>';
}
motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; syncHeroMotion(); });
new IntersectionObserver(entries => entries.forEach(e => shoeHero.classList.toggle('is-visible', e.isIntersecting)), { threshold: 0 }).observe(shoeHero);
reduced.addEventListener('change', syncHeroMotion);
document.addEventListener('visibilitychange', syncHeroMotion);
syncHeroMotion();

/* ---------- Botão fixo de agendamento no celular ---------- */
const waBar = document.querySelector('.wa-bar');
const closing = document.querySelector('#conversa');
let heroOut = false, closingIn = false;
function syncWaBar() { waBar.hidden = !(heroOut && !closingIn); }
new IntersectionObserver(e => { heroOut = !e[0].isIntersecting; syncWaBar(); }, { threshold: 0.15 }).observe(shoeHero);
new IntersectionObserver(e => { closingIn = e[0].isIntersecting; syncWaBar(); }, { threshold: 0.2 }).observe(closing);

/* ---------- Serviços ---------- */
const services = [
  { name: 'Sessão Dupla', headline: 'Dois encontros para conhecer o cuidado da CareFit.', description: 'Por R$ 230, você tem 80 minutos de avaliação e recovery personalizado no primeiro encontro e retorno de 1 hora em até 15 dias. São dois atendimentos para você, em dias diferentes, sem obrigação de contratar um plano depois.', short: 'Conhecer, cuidar e acompanhar.', points: ['R$ 230 pelos dois encontros', 'Primeiro atendimento de 80 minutos', 'Retorno de 1 hora em até 15 dias'], image: '/jornada-home/assets/service-recovery.jpg', pos: 'center 78%', cta: 'Agendar minha Sessão Dupla', url: '/primeira-sessao?servico=dupla' },
  { name: 'Dor ou lesão', headline: 'A dor está limitando sua corrida?', description: 'Comece pela avaliação de reabilitação: R$ 180 por 80 minutos com fisioterapeuta para conversar sobre seu histórico, realizar a avaliação física e propor os próximos passos. O valor corresponde à avaliação inicial.', short: 'Comece pela avaliação.', points: ['Avaliação de reabilitação: R$ 180', '80 minutos com fisioterapeuta', 'Proposta de tratamento para o seu caso'], image: '/jornada-home/assets/service-reab.jpg', cta: 'Agendar minha avaliação', url: '/primeira-sessao?servico=reabilitacao' },
  { name: 'Primeira visita', headline: 'Tempo para entender o que trouxe você até aqui.', description: 'Conte como são seus treinos, o que tem sentido e o que quer alcançar. Essa conversa faz parte da avaliação e ajuda a direcionar o atendimento que você escolheu.', short: 'Sua história entra no cuidado.', points: ['Sua história e sua rotina', 'Avaliação com fisioterapeuta', 'Explicações sobre o cuidado'], image: '/jornada-home/assets/service-forca.jpg', cta: 'Escolher meu atendimento', url: '/primeira-sessao' },
  { name: 'Segundo encontro', headline: 'Voltar também faz parte do cuidado.', description: 'Na Sessão Dupla, o retorno de 1 hora está incluído. Em até 15 dias, a equipe acompanha sua resposta, ajusta o cuidado e conversa sobre os próximos passos.', short: 'Acompanhar sua resposta.', points: ['Incluído na Sessão Dupla', '1 hora de atendimento', 'Em até 15 dias após a primeira visita'], image: '/jornada-home/assets/service-yoga.jpg', caption: 'ESPAÇO CAREFIT', cta: 'Agendar minha Sessão Dupla', url: '/primeira-sessao?servico=dupla' },
  { name: 'Como agendar', headline: 'Escolha seu atendimento e encontre um horário.', description: 'Selecione Sessão Dupla ou avaliação de reabilitação. Depois, escolha o profissional e veja a agenda. Seu horário fica confirmado após o pagamento e a confirmação da equipe pelo WhatsApp.', short: 'Um primeiro passo claro.', points: ['Escolha o atendimento', 'Veja profissional e horários', 'Confirme com a equipe'], image: '/jornada-home/assets/service-teste.jpg', cta: 'Ver atendimentos e horários', url: '/primeira-sessao' }
];
let activeService = 0;
const stage = document.querySelector('#service-stage');
const tabs = document.querySelector('#service-tabs');
services.forEach((s, i) => {
  const card = document.createElement('button');
  card.className = 'service-card';
  card.setAttribute('aria-label', 'Conhecer ' + s.name);
  card.setAttribute('aria-controls', 'service-headline');
  const media = s.image
    ? '<img src="' + s.image + '" alt="" loading="lazy" width="480" height="640" style="--pos:' + (s.pos || 'center') + '">'
    : '<div class="force-art" aria-hidden="true"><span>AVALIAÇÃO DE FORÇA</span><div class="bars"><i style="--bar:80%"></i><i style="--bar:65%"></i><i style="--bar:95%"></i><i style="--bar:85%"></i></div><p>ESQUERDA / DIREITA</p></div>';
  card.innerHTML = media + '<span class="card-number">0' + (i + 1) + '</span>' + (s.caption ? '<span class="photo-caption">' + s.caption + '</span>' : '') + '<span class="card-copy"><strong>' + s.name + '</strong><small>' + s.short + '</small><ul class="card-points">' + s.points.map(p => '<li>' + p + '</li>').join('') + '</ul></span>';
  card.addEventListener('click', () => selectService(i));
  stage.append(card);
  const tab = document.createElement('button');
  tab.textContent = s.name;
  tab.addEventListener('click', () => selectService(i));
  tabs.append(tab);
});
function selectService(index) {
  activeService = (index + services.length) % services.length;
  const s = services[activeService];
  [...stage.children].forEach((c, i) => {
    let slot = (i - activeService + services.length) % services.length;
    if (slot > 2) slot -= services.length;
    const d = Math.abs(slot);
    c.style.setProperty('--slot', slot);
    c.style.setProperty('--drop', d * 32 + 'px');
    c.style.setProperty('--scale', 1 - d * .15);
    c.style.setProperty('--fade', 1 - d * .12);
    c.style.setProperty('--depth', 5 - d);
    c.classList.toggle('is-selected', d === 0);
    c.setAttribute('aria-pressed', String(d === 0));
  });
  [...tabs.children].forEach((c, i) => c.setAttribute('aria-pressed', String(i === activeService)));
  document.querySelector('#service-headline').textContent = s.headline;
  document.querySelector('#service-description').textContent = s.description;
  const link = document.querySelector('#service-cta');
  link.textContent = s.cta + ' ↗';
  link.href = s.url;
  document.querySelector('#service-position').textContent = String(activeService + 1).padStart(2, '0') + ' / 05';
}
document.querySelector('#service-prev').addEventListener('click', () => selectService(activeService - 1));
document.querySelector('#service-next').addEventListener('click', () => selectService(activeService + 1));
stage.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    selectService(activeService + (e.key === 'ArrowRight' ? 1 : -1));
    stage.children[activeService].focus({ preventScroll: true });
  }
});
let swipeStart = null, swiped = false;
stage.addEventListener('pointerdown', e => { swipeStart = { x: e.clientX, y: e.clientY }; swiped = false; });
stage.addEventListener('pointerup', e => {
  if (!swipeStart) return;
  const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; selectService(activeService + (dx < 0 ? 1 : -1)); }
});
stage.addEventListener('pointercancel', () => { swipeStart = null; });
stage.addEventListener('click', e => { if (swiped) { e.preventDefault(); e.stopImmediatePropagation(); swiped = false; } }, true);
selectService(0);

/* ---------- Números: contam uma vez ao entrar ---------- */
const numberBlock = document.querySelector('.method-numbers');
if (numberBlock) {
  const counters = [...numberBlock.querySelectorAll('strong')].map(el => {
    const finalText = el.textContent.trim();
    const accessible = document.createElement('span');
    accessible.className = 'sr-only';
    accessible.textContent = finalText;
    el.setAttribute('aria-hidden', 'true');
    el.after(accessible);
    return { el, finalText, target: Number(finalText.replace(/[^0-9]/g, '')), prefix: finalText.startsWith('+') ? '+' : '' };
  });
  let counterFrame = 0, started = false;
  const finishCounters = () => { cancelAnimationFrame(counterFrame); counters.forEach(c => c.el.textContent = c.finalText); };
  const numberObserver = new IntersectionObserver(entries => {
    if (started || !entries.some(e => e.isIntersecting)) return;
    started = true; numberObserver.disconnect();
    if (reduced.matches) { finishCounters(); return; }
    const start = performance.now(), duration = 2400;
    const tick = now => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      counters.forEach(c => { const v = c.prefix + Math.floor(c.target * eased); if (c.el.textContent !== v) c.el.textContent = v; });
      if (p < 1) counterFrame = requestAnimationFrame(tick); else finishCounters();
    };
    counterFrame = requestAnimationFrame(tick);
  }, { threshold: 0.35 });
  if (reduced.matches) { started = true; finishCounters(); }
  else { counters.forEach(c => c.el.textContent = c.prefix + '0'); numberObserver.observe(numberBlock); }
  reduced.addEventListener('change', () => { if (reduced.matches) { started = true; numberObserver.disconnect(); finishCounters(); } });
}

/* ---------- Ferramentas + cena do cuidado (sem métrica inventada) ---------- */
const careTools = [
  { name: 'Sua história', description: 'Rotina, histórico e objetivos organizados em um mapa construído com você.' },
  { name: 'Seus treinos', description: 'Os registros disponíveis ajudam a equipe a conversar sobre sua semana e sua preparação.' },
  { name: 'Crioterapia', description: 'Imersão em água fria que pode fazer parte do recovery, conforme a avaliação.' },
  { name: 'Fotobiomodulação', description: 'Um dos recursos que a fisioterapeuta pode indicar para o seu cuidado.' },
  { name: 'Força e avaliação', description: 'Avaliações e fortalecimento que podem fazer parte dos próximos passos do seu acompanhamento.' },
  { name: 'Compressão', description: 'Botas de compressão que podem ser utilizadas na sessão, quando indicadas.' }
];
const careSystem = document.querySelector('.care-system');
const carePlay = document.querySelector('#care-play');
const carePhase = document.querySelector('#care-phase');
let careAnimation = null, carePlayed = false;
function selectCareTool(index) {
  document.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.tool) === index)));
  document.querySelector('#tool-name').textContent = careTools[index].name;
  document.querySelector('#tool-description').textContent = careTools[index].description;
}
document.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => selectCareTool(Number(b.dataset.tool))));
const PHASE_TEXT = {
  effort: 'O treino e a rotina exigem de você.',
  adjust: 'A CareFit escuta, avalia e ajusta o cuidado.',
  renew: 'O primeiro passo é conhecer você.'
};
function syncCarePhase(time) {
  const phase = time < 2600 ? 'effort' : time < 4500 ? 'adjust' : 'renew';
  if (careSystem.dataset.phase === phase) return;
  careSystem.dataset.phase = phase;
  carePhase.textContent = PHASE_TEXT[phase];
}
function endCare() { careSystem.classList.remove('is-running'); carePlay.textContent = 'Rever animação ↻'; carePlay.setAttribute('aria-label', 'Rever animação do cuidado'); }
function playCare() {
  if (reduced.matches) { careSystem.dataset.phase = 'renew'; carePhase.textContent = 'A CareFit escuta, avalia e ajusta o cuidado ao seu momento.'; return; }
  if (careAnimation && careAnimation.playState === 'running') { careAnimation.pause(); careSystem.classList.remove('is-running'); carePlay.textContent = 'Continuar animação ▶'; carePlay.setAttribute('aria-label', 'Continuar animação do cuidado'); return; }
  if (careAnimation && careAnimation.playState === 'paused') { careAnimation.play(); careSystem.classList.add('is-running'); carePlay.textContent = 'Pausar animação Ⅱ'; carePlay.setAttribute('aria-label', 'Pausar animação do cuidado'); return; }
  carePlayed = true;
  careSystem.classList.add('is-running');
  syncCarePhase(0);
  carePlay.textContent = 'Pausar animação Ⅱ';
  carePlay.setAttribute('aria-label', 'Pausar animação do cuidado');
  // Relógio da cena: só marca o tempo das três fases, não mostra número nenhum.
  careAnimation = careSystem.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 7000, fill: 'forwards' });
  careAnimation.onfinish = () => { syncCarePhase(7000); endCare(); };
}
carePlay.addEventListener('click', playCare);
setInterval(() => { if (careAnimation && careAnimation.playState === 'running') syncCarePhase(Number(careAnimation.currentTime) || 0); }, 250);
new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting && !carePlayed && !reduced.matches) playCare();
    else if (!entry.isIntersecting && careAnimation && careAnimation.playState === 'running') playCare();
  }
}, { threshold: .35 }).observe(careSystem);
document.addEventListener('visibilitychange', () => { if (document.hidden && careAnimation && careAnimation.playState === 'running') playCare(); });
function reduceCare() {
  if (reduced.matches) {
    if (careAnimation) careAnimation.cancel();
    careAnimation = null; carePlayed = true;
    careSystem.classList.remove('is-running');
    careSystem.dataset.phase = 'renew';
    carePlay.disabled = true;
    carePlay.textContent = 'Movimento reduzido';
    carePhase.textContent = 'A CareFit escuta, avalia e ajusta o cuidado ao seu momento.';
  } else { carePlay.disabled = false; carePlay.textContent = 'Ver o cuidado em ação ↗'; }
}
reduced.addEventListener('change', reduceCare); reduceCare();

/* ---------- Corredora 3D: a biblioteca só baixa perto da seção ---------- */
(function () {
  const runner = document.querySelector('#carefit-runner');
  const button = document.querySelector('#runner-pause');
  let visible = false, paused = false, libRequested = false;
  function loadLib() {
    if (libRequested) return; libRequested = true;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = '/jornada-home/assets/model-viewer-4.min.js';
    document.head.append(s);
  }
  function sync() {
    if (!runner.play) return;
    const stop = paused || reduced.matches || !visible || document.hidden;
    if (stop) runner.pause(); else runner.play();
    button.textContent = paused ? 'Retomar corredora' : 'Pausar corredora';
    button.setAttribute('aria-pressed', String(paused));
  }
  button.addEventListener('click', () => { paused = !paused; sync(); });
  runner.addEventListener('load', sync);
  new IntersectionObserver(e => { if (e[0].isIntersecting) loadLib(); }, { rootMargin: '900px 0px' }).observe(runner);
  new IntersectionObserver(e => { visible = e[0].isIntersecting; sync(); }).observe(runner);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
})();

/* ---------- Semana ilustrativa ---------- */
const weekContext = [['SEG', 'Seus treinos', ''], ['TER', 'Sua rotina', 'care'], ['QUA', 'Como você se sente', 'care'], ['QUI', 'Seu descanso', 'rest'], ['SEX', 'Seus objetivos', '']];
const scenarios = [
  { events: weekContext, heading: 'Abra espaço para cuidar de você.', message: 'A Sessão Dupla é uma forma de conhecer o recovery da CareFit, conversar sobre sua rotina e acompanhar sua resposta em dois encontros.' },
  { events: weekContext, heading: 'Traga sua preparação para a conversa.', message: 'Conte sobre a prova, os treinos e como tem se sentido. Na Sessão Dupla, a avaliação orienta o cuidado para o seu momento de preparação.' },
  { events: weekContext, heading: 'Comece pela avaliação de reabilitação.', message: 'Se uma dor ou lesão está limitando sua corrida, o primeiro passo aqui é avaliar o seu caso. A fisioterapeuta considera seu histórico e os achados da avaliação para orientar os próximos passos.' }
];
function setScenario(n) {
  const s = scenarios[n];
  const week = document.querySelector('#week');
  week.classList.remove('animate');
  week.replaceChildren(...s.events.map(([day, event, type]) => {
    const row = document.createElement('div'); row.className = 'day';
    const label = document.createElement('span'); label.textContent = day;
    const item = document.createElement('div'); item.className = 'event ' + type; item.textContent = event;
    row.append(label, item); return row;
  }));
  week.classList.add('animate');
  document.querySelector('#week-heading').textContent = s.heading;
  document.querySelector('#week-message').textContent = s.message;
  document.querySelectorAll('[data-scenario]').forEach(b => {
    const selected = Number(b.dataset.scenario) === n;
    b.classList.toggle('active', selected);
    b.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelectorAll('[data-scenario]').forEach(b => b.addEventListener('click', () => setScenario(Number(b.dataset.scenario))));
setScenario(0);

/* ---------- Relatos em vídeo: um toca por vez, nada começa sozinho ---------- */
const storyVideos = [...document.querySelectorAll('.story-video video')];
storyVideos.forEach((v) => v.addEventListener('play', () => {
  storyVideos.forEach((o) => { if (o !== v && !o.paused) o.pause(); });
}));

/* ---------- Relatos ---------- */
const stories = [
  { quote: 'Fisioterapia e recovery você encontra em vários lugares. Mas se sentir único, alguém que te olha como indivíduo, foi o que eu só encontrei aqui.', name: 'Eduardo Torciano', ig: 'edutorciano' },
  { quote: 'Desde a primeira vez, eu senti: estou amparado aqui.', name: 'Guilherme Elias', ig: 'guielias98' },
  { quote: 'A CareFit fez todo o diferencial até na parte psicológica, porque eu entendi como meu corpo funcionava.', name: 'Talita Kriunas', ig: 'eutalitakriunas' },
  { quote: 'Para quem quer levar o esporte a sério, seja por performance ou qualidade de vida, precisa desse acompanhamento.', name: 'Léo Andrade', ig: 'leo_andradess' }
];
let currentStory = 0;
const dots = document.querySelector('.story-dots');
stories.forEach((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Ver relato de ' + s.name);
  b.addEventListener('click', () => showStory(i));
  dots.append(b);
});
function showStory(n) {
  currentStory = (n + stories.length) % stories.length;
  const s = stories[currentStory];
  document.querySelector('#quote').textContent = s.quote;
  const a = document.querySelector('#author');
  a.textContent = s.name + ' ↗';
  a.href = 'https://www.instagram.com/' + s.ig + '/';
  document.querySelector('#story-count').textContent = String(currentStory + 1).padStart(2, '0') + ' / 04';
  [...dots.children].forEach((b, i) => { b.classList.toggle('active', i === currentStory); b.setAttribute('aria-pressed', String(i === currentStory)); });
}
document.querySelector('#prev-story').addEventListener('click', () => showStory(currentStory - 1));
document.querySelector('#next-story').addEventListener('click', () => showStory(currentStory + 1));
showStory(0);

/* Navegação do site: fechar ao sair, navegar ou pressionar Escape. */
const siteMenuButton = document.querySelector('.site-menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
function closeSiteNavigation() {
  siteNavigation.classList.remove('is-open');
  siteMenuButton.setAttribute('aria-expanded', 'false');
  siteNavigation.querySelectorAll('details[open]').forEach(item => { item.open = false; });
}
siteMenuButton.addEventListener('click', () => {
  const open = siteMenuButton.getAttribute('aria-expanded') !== 'true';
  siteMenuButton.setAttribute('aria-expanded', String(open));
  siteNavigation.classList.toggle('is-open', open);
});
siteNavigation.addEventListener('click', event => { if (event.target.closest('a')) closeSiteNavigation(); });
document.addEventListener('click', event => { if (!event.target.closest('header')) closeSiteNavigation(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && (siteNavigation.querySelector('details[open]') || siteNavigation.classList.contains('is-open'))) {
    const activeSummary = siteNavigation.querySelector('details[open] summary');
    closeSiteNavigation();
    if (getComputedStyle(siteMenuButton).display !== 'none') siteMenuButton.focus();
    else activeSummary?.focus();
  }
});
siteNavigation.querySelectorAll('details').forEach(group => group.addEventListener('toggle', () => {
  if (group.open) siteNavigation.querySelectorAll('details').forEach(other => { if (other !== group) other.open = false; });
}));

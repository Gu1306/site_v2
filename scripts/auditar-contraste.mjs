// Auditoria de contraste: mede todo texto visível em cada rota pública do site, em 1280 e 390 px,
// e lista o que fica abaixo de 4,5:1 (texto até 23px) ou 3:1 (texto grande). Feito em 25/11/2026.
//
// Uso (com o site rodando: npm run build && PORT=4176 node server/index.mjs):
//   node scripts/auditar-contraste.mjs http://127.0.0.1:4176 auditoria.json
// No Git Bash, prefixe com MSYS_NO_PATHCONV=1.
//
// Depende do playwright-core (pegamos o do carefit-canvas-gen, que já tem instalado) e do Chrome
// do Windows. Limite conhecido: não enxerga camada escura posta por elemento irmão ou foto
// (falso positivo "branco sobre branco") nem legenda que só aparece no hover.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire("C:/Projetos/carefit-canvas-gen/package.json");
const { chromium } = require("playwright-core");

const BASE = process.argv[2] || "http://127.0.0.1:4176";
const SAIDA = process.argv[3] || "auditoria.json";

const ROTAS = [
  "/", "/planos", "/espaco", "/comunidade", "/contato", "/agendar", "/ice-mind-experience",
  "/nossa-historia", "/carefit-cast", "/fisioterapia-para-corredores-ribeirao-preto",
  "/recovery-corredores-ribeirao-preto", "/avaliacao-do-corredor-ribeirao-preto",
  "/fortalecimento-para-corredores-ribeirao-preto", "/teste-de-forca-ribeirao-preto",
  "/fisioterapia-para-triatletas-ribeirao-preto", "/treinamento-para-maratona-ribeirao-preto",
  "/prevencao-de-lesoes-na-corrida-ribeirao-preto", "/lesoes-na-corrida", "/canelite-ribeirao-preto",
  "/fascite-plantar-ribeirao-preto", "/dor-no-joelho-corrida-ribeirao-preto", "/tendinite-aquiles-ribeirao-preto",
  "/banda-iliotibial-ribeirao-preto", "/fratura-por-estresse-ribeirao-preto", "/performance-ribeirao-preto",
  "/conheca-a-carefit", "/fortalecimento-em-turma", "/agendamento-fortalecimento", "/agendamento-yoga",
  "/links", "/primeira-sessao", "/primeira-sessao?servico=reabilitacao", "/lp/fisioterapia-ribeirao-preto",
  "/lp/canelite", "/lp/recovery", "/privacidade", "/blog", "/blog/alison-dos-santos-liga-diamante-ribeirao-preto",
  "/manifesto", "/servicos", "/feedback", "/rota-que-nao-existe",
];

// Roda dentro da página: devolve cada texto visível com cor, fundo efetivo e contraste.
const AUDITORIA = () => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const blend = (top, bot) => ({
    r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a),
    b: top.b * top.a + bot.b * (1 - top.a), a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const coresDoGradiente = (img) => (img.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean);

  // Fundo efetivo: lista de cores possíveis atrás do elemento (mais de uma quando há gradiente).
  const fundos = (el) => {
    let camadas = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") {
        if (cs.backgroundImage.includes("url(")) return { tipo: "imagem" };
        const cores = coresDoGradiente(cs.backgroundImage);
        if (cores.length) {
          const base = { r: 255, g: 255, b: 255, a: 1 };
          const opcoes = cores.map((c) => camadas.reduceRight((acc, cam) => blend(cam, acc), c.a < 1 ? blend(c, base) : c));
          return { tipo: "gradiente", opcoes };
        }
      }
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        if (bg.a >= 1) {
          const final = camadas.reduceRight((acc, cam) => blend(cam, acc), bg);
          return { tipo: "cor", opcoes: [final] };
        }
        camadas.push(bg);
      }
    }
    const branco = { r: 255, g: 255, b: 255, a: 1 };
    return { tipo: "cor", opcoes: [camadas.reduceRight((acc, cam) => blend(cam, acc), branco)] };
  };

  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.1) return false;
    }
    return true;
  };

  const saida = [];
  const vistos = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const texto = t.textContent.replace(/\s+/g, " ").trim();
    if (texto.length < 2) continue;
    const el = t.parentElement;
    if (!el || vistos.has(el) || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
    vistos.add(el);
    if (!visivel(el)) continue;
    const cs = getComputedStyle(el);
    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const fundo = fundos(el);
    if (fundo.tipo === "imagem") continue;
    const tam = parseFloat(cs.fontSize);
    const peso = Number(cs.fontWeight) || 400;
    const grande = tam >= 24 || (tam >= 18.66 && peso >= 700);
    const exigido = grande ? 3 : 4.5;
    let pior = 99, piorBg = null, piorFg = null;
    for (const bg of fundo.opcoes) {
      const fg = fg0.a < 1 ? blend(fg0, bg) : fg0;
      const r = ratio(fg, bg);
      if (r < pior) { pior = r; piorBg = bg; piorFg = fg; }
    }
    if (pior < exigido) {
      saida.push({
        texto: texto.slice(0, 60), fg: hex(piorFg), bg: hex(piorBg), fundo: fundo.tipo,
        razao: Math.round(pior * 100) / 100, exigido, tam, peso,
        classe: (el.getAttribute("class") || "").slice(0, 140),
        pai: (el.parentElement?.getAttribute("class") || "").slice(0, 100), tag: el.tagName,
      });
    }
  }
  return saida;
};

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const resultado = {};
for (const largura of [1280, 390]) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const rota of ROTAS) {
    try {
      await page.goto(BASE + rota, { waitUntil: "networkidle", timeout: 30000 });
      // Rola a página inteira para disparar as animações de entrada (IntersectionObserver).
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 900));
      });
      const falhas = await page.evaluate(AUDITORIA);
      resultado[`${largura} ${rota}`] = falhas;
      console.log(`${largura} ${rota}: ${falhas.length} falhas`);
    } catch (e) {
      resultado[`${largura} ${rota}`] = [{ erro: String(e).slice(0, 200) }];
      console.log(`${largura} ${rota}: ERRO ${String(e).slice(0, 120)}`);
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 1));
console.log("gravado", SAIDA);

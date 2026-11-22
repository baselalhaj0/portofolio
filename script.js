document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Terminal typing ---------- */
const term = document.getElementById('term');
const fill = document.getElementById('fill');
const pct = document.getElementById('pct');

const P = '<span class="prompt">basel@dev</span>:<span class="path">~/portofolio</span>$ ';
const script = [
  { cmd: 'git clone github.com/baselalhaj0/portofolio' },
  { out: '<span class="dim">Cloning into \'portofolio\'... done.</span>', p: 15 },
  { cmd: 'npm run build -- --awesome' },
  { out: '<span class="info">›</span> compiling ideas.......... <span class="ok">✔</span>', p: 35 },
  { out: '<span class="info">›</span> optimizing pixels........ <span class="ok">✔</span>', p: 55 },
  { out: '<span class="info">›</span> brewing coffee........... <span class="ok">✔</span>', p: 72 },
  { cmd: 'deploy --target baselalhaj.com' },
  { out: '<span class="dim">status:</span> <span class="ok">coming soon</span> 🚀', p: 87 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setProgress(v) {
  fill.style.width = v + '%';
  pct.textContent = v + '%';
}

async function run() {
  let html = '';
  for (const step of script) {
    if (step.cmd) {
      const base = html + P;
      for (let i = 1; i <= step.cmd.length; i++) {
        term.innerHTML = base + step.cmd.slice(0, i) + '<span class="cursor"></span>';
        if (!reduced) await sleep(28 + Math.random() * 40);
      }
      html = base + step.cmd + '\n';
      if (!reduced) await sleep(350);
    } else {
      html += step.out + '\n';
      term.innerHTML = html + '<span class="cursor"></span>';
      if (!reduced) await sleep(420);
    }
    if (step.p) setProgress(step.p);
  }
  term.innerHTML = html + P + '<span class="cursor"></span>';
}
run();

/* ---------- Background: floating code particles ---------- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
const glyphs = ['{', '}', '<', '/>', '()', '=>', ';', '[]', '01', '&&', '#', '$'];
let W, H, particles;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = innerWidth * dpr;
  H = canvas.height = innerHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  const count = Math.round(Math.min(60, (innerWidth * innerHeight) / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vy: 0.15 + Math.random() * 0.45,
    size: 10 + Math.random() * 8,
    a: 0.15 + Math.random() * 0.45,
    g: glyphs[(Math.random() * glyphs.length) | 0],
    c: Math.random() > 0.5 ? '34,211,238' : '167,139,250',
  }));
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.vy;
    if (p.y < -20) { p.y = innerHeight + 20; p.x = Math.random() * innerWidth; }
    ctx.font = `${p.size}px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(${p.c},${p.a})`;
    ctx.fillText(p.g, p.x, p.y);
  }
  requestAnimationFrame(draw);
}

resize();
addEventListener('resize', resize);
if (!reduced) draw();

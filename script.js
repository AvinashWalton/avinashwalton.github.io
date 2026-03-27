/* ═══════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .skill-item, .kp-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '0.5'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.opacity = '1'; });
});

/* ═══════════════════════════════════════
   VEDIC COSMIC BACKGROUND CANVAS
═══════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, stars = [], shootingStars = [], nebulae = [];
let cosmicT = 0;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildNebulae();
}

function buildNebulae() {
  nebulae = [];
  const count = Math.max(3, Math.floor(W * H / 250000));
  for (let i = 0; i < count; i++) {
    nebulae.push({
      x: Math.random() * W, y: Math.random() * H,
      r: 80 + Math.random() * 220,
      hue: [20, 30, 15, 35][Math.floor(Math.random() * 4)],
      alpha: 0.06 + Math.random() * 0.09
    });
  }
}

function buildStars() {
  stars = [];
  const total = Math.floor(W * H / 1400);
  for (let i = 0; i < total; i++) {
    const size = Math.random();
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: size < 0.7 ? 0.4 + Math.random() * 0.6
        : size < 0.92 ? 0.9 + Math.random() * 0.8
        : 1.5 + Math.random() * 1.2,
      baseA: 0.15 + Math.random() * 0.75,
      speed: 0.004 + Math.random() * 0.018,
      phase: Math.random() * Math.PI * 2,
      cr: [255, 240, 220, 255][Math.floor(Math.random() * 4)],
      cg: [240, 210, 160, 200][Math.floor(Math.random() * 4)],
      cb: [200, 140,  60, 120][Math.floor(Math.random() * 4)]
    });
  }
}

function spawnShooter() {
  if (shootingStars.length > 3) return;
  const angle = Math.PI * (0.1 + Math.random() * 0.4);
  shootingStars.push({
    x: Math.random() * W * 0.7, y: Math.random() * H * 0.5,
    vx: Math.cos(angle) * (4 + Math.random() * 5),
    vy: Math.sin(angle) * (4 + Math.random() * 5),
    len: 60 + Math.random() * 80,
    alpha: 0.9, decay: 0.015 + Math.random() * 0.012
  });
}

function drawFrame() {
  ctx.clearRect(0, 0, W, H);
  cosmicT += 0.012;

  nebulae.forEach(n => {
    const pulse = 1 + 0.08 * Math.sin(cosmicT * 0.3 + n.x);
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * pulse);
    g.addColorStop(0,   `hsla(${n.hue},90%,18%,${n.alpha * 1.8})`);
    g.addColorStop(0.4, `hsla(${n.hue},80%,12%,${n.alpha})`);
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2); ctx.fill();
  });

  const ex = W * 0.82, ey = H * 0.18;
  const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, W * 0.22);
  eg.addColorStop(0,   'rgba(255,80,0,0.1)');
  eg.addColorStop(0.5, 'rgba(200,50,0,0.05)');
  eg.addColorStop(1,   'transparent');
  ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);

  const mg = ctx.createRadialGradient(W * 0.08, H * 0.75, 0, W * 0.08, H * 0.75, W * 0.28);
  mg.addColorStop(0, 'rgba(255,140,0,0.08)');
  mg.addColorStop(1, 'transparent');
  ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    const a = s.baseA * (0.45 + 0.55 * Math.sin(cosmicT * s.speed * 60 + s.phase));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},${a})`; ctx.fill();
    if (s.r > 1.4 && a > 0.55) {
      const len = s.r * 3.5 * a;
      ctx.strokeStyle = `rgba(${s.cr},${s.cg},${s.cb},${a * 0.35})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
      ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
    }
  });

  shootingStars = shootingStars.filter(ss => ss.alpha > 0.01);
  shootingStars.forEach(ss => {
    const tail = ctx.createLinearGradient(
      ss.x - ss.vx * (ss.len / 5), ss.y - ss.vy * (ss.len / 5), ss.x, ss.y
    );
    tail.addColorStop(0, 'transparent');
    tail.addColorStop(1, `rgba(255,220,150,${ss.alpha})`);
    ctx.beginPath();
    ctx.moveTo(ss.x - ss.vx * (ss.len / 5), ss.y - ss.vy * (ss.len / 5));
    ctx.lineTo(ss.x, ss.y);
    ctx.strokeStyle = tail; ctx.lineWidth = 1.5; ctx.stroke();
    ss.x += ss.vx; ss.y += ss.vy; ss.alpha -= ss.decay;
  });

  requestAnimationFrame(drawFrame);
}

resize();
buildStars();
window.addEventListener('resize', () => { resize(); buildStars(); });
setInterval(spawnShooter, 3500 + Math.random() * 4000);
drawFrame();

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════
   SKILL BAR ANIMATION
═══════════════════════════════════════ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-grid').forEach(g => skillObserver.observe(g));

/* ═══════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════ */
function animateCounter(el, target) {
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 40);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el =>
        animateCounter(el, parseInt(el.getAttribute('data-count')))
      );
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stat-strip').forEach(s => counterObserver.observe(s));

/* ═══════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════ */
const phrases = [
  'Aspiring Data Analyst',
  'Creative Entrepreneur',
  'Digital Content Strategist',
  'Founder of Indraseva Group',
  'Podcaster & Author'
];
const tw = document.getElementById('typewriter');
let pIdx = 0, cIdx = 0, deleting = false;

function typeWrite() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    tw.innerHTML = phrase.substring(0, cIdx + 1) + '<span class="cursor"></span>';
    cIdx++;
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeWrite, 1800); return; }
    setTimeout(typeWrite, 72);
  } else {
    tw.innerHTML = phrase.substring(0, cIdx - 1) + '<span class="cursor"></span>';
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeWrite, 300); return; }
    setTimeout(typeWrite, 38);
  }
}
typeWrite();

/* ═══════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

/* ═══════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════ */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('navLinks').classList.remove('active');
    }
  });
});

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (scrolled / maxScroll * 100) + '%';
}, { passive: true });

/* ═══════════════════════════════════════
   DIVINE SHLOKA ROTATOR
═══════════════════════════════════════ */
const shlokas = [
  { text: '"यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥"', source: '— Bhagavad Gita 4.7' },
  { text: '"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥"', source: '— Bhagavad Gita 2.47' },
  { text: '"सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु। मा कश्चिद्दुःखभाग्भवेत्॥"', source: '— Brihadaranyaka Upanishad' },
  { text: '"अहं ब्रह्मास्मि" — I am Brahman. The infinite consciousness dwells within you.', source: '— Brihadaranyaka Upanishad 1.4.10' },
  { text: '"तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।" — Lead me from darkness to light, from death to immortality.', source: '— Brihadaranyaka Upanishad 1.3.28' }
];
let shIdx = 0;
const shText = document.getElementById('shlokaText');
const shSrc  = document.getElementById('shlokaSource');
const shDots = document.getElementById('shlokaDots');

function buildDots() {
  shDots.innerHTML = '';
  shlokas.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'shloka-dot' + (i === shIdx ? ' active' : '');
    d.onclick = () => { shIdx = i; showShloka(true); };
    shDots.appendChild(d);
  });
}

function showShloka(immediate) {
  if (!immediate) shText.style.opacity = '0';
  setTimeout(() => {
    shText.textContent = shlokas[shIdx].text;
    shSrc.textContent  = shlokas[shIdx].source;
    shText.style.opacity = '1';
    buildDots();
  }, immediate ? 0 : 400);
}
showShloka(true);
setInterval(() => { shIdx = (shIdx + 1) % shlokas.length; showShloka(false); }, 6000);

/* ═══════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════ */
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => { btt.style.display = window.scrollY > 400 ? 'block' : 'none'; });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════
   VEDIC FLOATING MANTRAS
═══════════════════════════════════════ */
const mantras = ['ॐ', 'सीताराम', 'राधे कृष्ण', 'ॐ', 'हरे राम', 'राधे कृष्ण', 'सीताराम', 'ॐ'];
const mantrasWrap = document.getElementById('mantras-wrap');
const mantraColors = [
  'rgba(255,140,30,0.22)',
  'rgba(255,100,0,0.18)',
  'rgba(220,70,0,0.16)',
  'rgba(255,180,60,0.2)',
  'rgba(255,120,10,0.18)'
];

function spawnMantra() {
  const m = document.createElement('div');
  m.className = 'mantra-float';
  const text  = mantras[Math.floor(Math.random() * mantras.length)];
  const size  = 13 + Math.random() * 18;
  const left  = 2  + Math.random() * 94;
  const dur   = 22 + Math.random() * 28;
  const delay = Math.random() * 3;
  const rot   = -8 + Math.random() * 16;
  const maxA  = 0.13 + Math.random() * 0.14;
  const col   = mantraColors[Math.floor(Math.random() * mantraColors.length)];
  m.textContent = text;
  m.style.cssText = `
    left: ${left}vw;
    bottom: -60px;
    font-size: ${size}px;
    color: ${col};
    --r: ${rot}deg;
    --max-a: ${maxA};
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    text-shadow: 0 0 12px rgba(255,120,0,0.3);
    letter-spacing: 2px;
  `;
  mantrasWrap.appendChild(m);
  setTimeout(() => m.remove(), (dur + delay + 1) * 1000);
}

for (let i = 0; i < 5; i++) setTimeout(spawnMantra, i * 2000);
setInterval(spawnMantra, 2800);

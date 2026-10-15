/* ============================================
   DINO RUNNER — PLANO CARTESIANO
   Interactive JavaScript Engine
   ============================================ */

// ==========================================
// SOUND MANAGER
// ==========================================
class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.enabled = false;
    }
  }

  play(type) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      const now = this.ctx.currentTime;

      switch (type) {
        case 'jump':
          osc.type = 'square';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case 'collision':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'success':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          osc.frequency.setValueAtTime(784, now + 0.2);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'complete':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.15);
          osc.frequency.setValueAtTime(784, now + 0.3);
          osc.frequency.setValueAtTime(1047, now + 0.45);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
          osc.start(now);
          osc.stop(now + 0.7);
          break;
        case 'click':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
      }
    } catch (e) { /* silent */ }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sound = new SoundManager();

// ==========================================
// SPRITE DRAWING FUNCTIONS
// ==========================================
function drawDino(ctx, x, y, scale = 1, isJumping = false, frame = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bw = 2.5;
  ctx.lineWidth = bw;
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Body color
  const body = '#4ADE80';
  const belly = '#86EFAC';
  const darker = '#22C55E';

  // Tail
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-14, -30);
  ctx.quadraticCurveTo(-32, -38, -28, -18);
  ctx.quadraticCurveTo(-24, -24, -14, -22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, -22, 16, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Belly
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(2, -16, 10, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(6, -48, 14, 11, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Mouth
  ctx.beginPath();
  ctx.moveTo(14, -43);
  ctx.lineTo(21, -43);
  ctx.stroke();

  // Eye white
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(12, -51, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupil
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(14, -51, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(15, -53, 1, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  ctx.fillStyle = darker;
  ctx.lineWidth = bw;
  ctx.beginPath();
  ctx.moveTo(12, -30);
  ctx.lineTo(20, -24);
  ctx.lineTo(18, -20);
  ctx.stroke();

  // Legs
  if (!isJumping) {
    const legAnim = Math.sin(frame * 0.25) * 6;
    // Left leg
    ctx.fillStyle = darker;
    ctx.fillRect(-10, -2, 8, 14 + legAnim);
    ctx.strokeRect(-10, -2, 8, 14 + legAnim);
    // Foot
    ctx.fillRect(-12, 12 + legAnim, 12, 5);
    ctx.strokeRect(-12, 12 + legAnim, 12, 5);
    // Right leg
    ctx.fillRect(2, -2, 8, 14 - legAnim);
    ctx.strokeRect(2, -2, 8, 14 - legAnim);
    ctx.fillRect(0, 12 - legAnim, 12, 5);
    ctx.strokeRect(0, 12 - legAnim, 12, 5);
  } else {
    // Tucked legs
    ctx.fillStyle = darker;
    ctx.fillRect(-10, -2, 8, 8);
    ctx.strokeRect(-10, -2, 8, 8);
    ctx.fillRect(2, -2, 8, 8);
    ctx.strokeRect(2, -2, 8, 8);
  }

  ctx.restore();
}

function drawTree(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bw = 2.5;
  ctx.lineWidth = bw;
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineJoin = 'round';

  // Trunk
  ctx.fillStyle = '#8B5E3C';
  ctx.fillRect(-5, -10, 10, 28);
  ctx.strokeRect(-5, -10, 10, 28);

  // Foliage layers
  const greens = ['#166534', '#15803D', '#22C55E'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = greens[i];
    ctx.beginPath();
    ctx.moveTo(0, -55 + i * 12);
    ctx.lineTo(-18 + i * 2, -18 + i * 12);
    ctx.lineTo(18 - i * 2, -18 + i * 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawGround(ctx, width, y, height) {
  // Road
  ctx.fillStyle = '#555';
  ctx.fillRect(0, y, width, height);
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, y, width, height);

  // Yellow dashes
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo(0, y + height / 2);
  ctx.lineTo(width, y + height / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

// ==========================================
// CARTESIAN CANVAS HELPER
// ==========================================
class CartesianCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.xRange = options.xRange || 240;
    this.yRange = options.yRange || 180;
    this.showGrid = options.showGrid !== false;
    this.showLabels = options.showLabels !== false;
    this.showGround = options.showGround || false;
    this.groundY = options.groundY || 0;
    this.padding = options.padding || 40;
    this.bgColor = options.bgColor || '#fffdf7';
    this.objects = [];
    this.highlightPoint = null;
    this.onResize = options.onResize || null;

    this.resize();
    this.draw();

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      if (this.onResize) {
        this.onResize();
      } else {
        this.draw();
      }
    });
    this.resizeObserver.observe(this.canvas.parentElement);
  }

  resize() {
    const parent = this.canvas.parentElement;
    const w = Math.max(parent.clientWidth - 10, 1);
    const ratio = (this.yRange * 2) / (this.xRange * 2);
    const h = Math.min(w * ratio, 500);
    this.canvas.width = w * (window.devicePixelRatio || 1);
    this.canvas.height = h * (window.devicePixelRatio || 1);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.w = w;
    this.h = h;
  }

  toCanvas(cx, cy) {
    const px = this.padding + ((cx + this.xRange) / (this.xRange * 2)) * (this.w - this.padding * 2);
    const py = this.padding + ((this.yRange - cy) / (this.yRange * 2)) * (this.h - this.padding * 2);
    return { x: px, y: py };
  }

  toCartesian(px, py) {
    const cx = ((px - this.padding) / (this.w - this.padding * 2)) * (this.xRange * 2) - this.xRange;
    const cy = this.yRange - ((py - this.padding) / (this.h - this.padding * 2)) * (this.yRange * 2);
    return { x: Math.round(cx), y: Math.round(cy) };
  }

  getScale() {
    return (this.w - this.padding * 2) / (this.xRange * 2) * 0.6;
  }

  draw() {
    const { ctx, w, h, padding } = this;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, w, h);

    const areaW = w - padding * 2;
    const areaH = h - padding * 2;

    // Grid
    if (this.showGrid) {
      ctx.strokeStyle = '#e0ddd5';
      ctx.lineWidth = 1;
      const gridStepX = this.xRange > 200 ? 60 : 50;
      const gridStepY = this.yRange > 200 ? 60 : 50;

      for (let gx = -this.xRange; gx <= this.xRange; gx += gridStepX) {
        if (gx === 0) continue;
        const p = this.toCanvas(gx, 0);
        ctx.beginPath();
        ctx.moveTo(p.x, padding);
        ctx.lineTo(p.x, h - padding);
        ctx.stroke();
      }
      for (let gy = -this.yRange; gy <= this.yRange; gy += gridStepY) {
        if (gy === 0) continue;
        const p = this.toCanvas(0, gy);
        ctx.beginPath();
        ctx.moveTo(padding, p.y);
        ctx.lineTo(w - padding, p.y);
        ctx.stroke();
      }
    }

    // Ground
    if (this.showGround) {
      const groundPos = this.toCanvas(-this.xRange, this.groundY);
      const groundBottom = this.toCanvas(-this.xRange, -this.yRange);
      ctx.fillStyle = 'rgba(85,85,85,0.15)';
      ctx.fillRect(padding, groundPos.y, areaW, groundBottom.y - groundPos.y);
    }

    // Axes
    const origin = this.toCanvas(0, 0);

    // X axis
    ctx.strokeStyle = '#ef476f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(padding, origin.y);
    ctx.lineTo(w - padding, origin.y);
    ctx.stroke();
    // Arrow
    ctx.fillStyle = '#ef476f';
    ctx.beginPath();
    ctx.moveTo(w - padding, origin.y);
    ctx.lineTo(w - padding - 10, origin.y - 5);
    ctx.lineTo(w - padding - 10, origin.y + 5);
    ctx.closePath();
    ctx.fill();

    // Y axis
    ctx.strokeStyle = '#3a86ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(origin.x, padding);
    ctx.lineTo(origin.x, h - padding);
    ctx.stroke();
    // Arrow
    ctx.fillStyle = '#3a86ff';
    ctx.beginPath();
    ctx.moveTo(origin.x, padding);
    ctx.lineTo(origin.x - 5, padding + 10);
    ctx.lineTo(origin.x + 5, padding + 10);
    ctx.closePath();
    ctx.fill();

    // Labels
    if (this.showLabels) {
      ctx.font = '700 13px Space Grotesk, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // X labels
      ctx.fillStyle = '#ef476f';
      const labelStepX = this.xRange > 200 ? 60 : 50;
      for (let lx = -this.xRange; lx <= this.xRange; lx += labelStepX) {
        if (lx === 0) continue;
        const p = this.toCanvas(lx, 0);
        ctx.fillText(lx, p.x, origin.y + 6);
        // Tick
        ctx.strokeStyle = '#ef476f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, origin.y - 4);
        ctx.lineTo(p.x, origin.y + 4);
        ctx.stroke();
      }

      // Y labels
      ctx.fillStyle = '#3a86ff';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const labelStepY = this.yRange > 200 ? 60 : 50;
      for (let ly = -this.yRange; ly <= this.yRange; ly += labelStepY) {
        if (ly === 0) continue;
        const p = this.toCanvas(0, ly);
        ctx.fillText(ly, origin.x - 8, p.y);
        ctx.strokeStyle = '#3a86ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(origin.x - 4, p.y);
        ctx.lineTo(origin.x + 4, p.y);
        ctx.stroke();
      }

      // Axis names
      ctx.font = '700 14px Space Grotesk, sans-serif';
      ctx.fillStyle = '#ef476f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('X', w - padding + 14, origin.y - 6);
      ctx.fillStyle = '#3a86ff';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText('Y', origin.x + 14, padding - 4);

      // Origin label
      ctx.font = '700 12px Space Grotesk, sans-serif';
      ctx.fillStyle = '#1a1a2e';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('(0,0)', origin.x - 6, origin.y + 6);
    }

    // Origin dot
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Highlight point
    if (this.highlightPoint) {
      const hp = this.toCanvas(this.highlightPoint.x, this.highlightPoint.y);

      // Dashed lines to axes
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255,107,53,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hp.x, hp.y);
      ctx.lineTo(hp.x, origin.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hp.x, hp.y);
      ctx.lineTo(origin.x, hp.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point
      ctx.fillStyle = '#ff6b35';
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#1a1a2e';
      ctx.font = '700 13px Space Grotesk, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`(${this.highlightPoint.x}, ${this.highlightPoint.y})`, hp.x + 10, hp.y - 8);
    }
  }
}

// ==========================================
// NAVIGATION
// ==========================================
const sections = [
  'hero', 'explanation', 'interactive-stage', 'jump-demo',
  'tree-movement', 'time-control', 'position-challenge',
  'tree-challenge', 'scratch-section', 'mini-game', 'summary'
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    if (initMap[id] && !initMap[id].done) {
      initMap[id].init();
      initMap[id].done = true;
    }
    el.scrollIntoView({ behavior: 'smooth' });
    sound.play('click');
  }
}

// Update active nav dot on scroll
function updateNavDots() {
  const scrollY = window.scrollY + window.innerHeight / 3;
  let activeIdx = 0;

  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      activeIdx = i;
    }
  });

  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIdx);
  });
}

window.addEventListener('scroll', updateNavDots, { passive: true });

// Nav dot click handlers
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    scrollToSection(dot.dataset.section);
  });
});

// Sound toggle
document.getElementById('sound-toggle').addEventListener('click', function () {
  if (!sound.ctx) sound.init();
  const enabled = sound.toggle();
  this.textContent = enabled ? '🔊' : '🔇';
});

// ==========================================
// HERO SECTION - Animated Dino
// ==========================================
let heroFrame = 0;
function animateHeroDino() {
  const canvas = document.getElementById('hero-dino-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 280, 200);

  // Ground
  drawGround(ctx, 280, 160, 40);

  // Dino bouncing animation
  const bounce = Math.sin(heroFrame * 0.05) * 5;
  drawDino(ctx, 80, 148 + bounce, 1.5, false, heroFrame);

  // Tree
  drawTree(ctx, 210, 150, 1.3);

  heroFrame++;
  requestAnimationFrame(animateHeroDino);
}

// ==========================================
// SECTION 2: EXPLANATION CANVAS
// ==========================================
let explanationCanvas;

function initExplanation() {
  explanationCanvas = new CartesianCanvas('explanation-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true,
    onResize: () => {
      if (explanationCanvas) explanationCanvas.draw();
    }
  });
  explanationCanvas.draw();
  requestAnimationFrame(() => {
    if (explanationCanvas) {
      explanationCanvas.resize();
      explanationCanvas.draw();
    }
  });

  // Example coordinate buttons
  document.querySelectorAll('.coord-example').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.coord-example').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const x = parseInt(btn.dataset.x);
      const y = parseInt(btn.dataset.y);
      explanationCanvas.highlightPoint = { x, y };
      explanationCanvas.draw();
      sound.play('click');
    });
  });
}

// ==========================================
// SECTION 3: INTERACTIVE STAGE
// ==========================================
let stageCanvas;

function initStage() {
  stageCanvas = new CartesianCanvas('stage-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true, showGround: true,
    onResize: drawStage
  });
  // Force resize + redraw on next frame to ensure canvas has correct dimensions
  requestAnimationFrame(() => {
    if (stageCanvas) {
      stageCanvas.resize();
      drawStage();
    }
  });
}

function drawStage() {
  if (!stageCanvas) return;
  stageCanvas.draw();
  const ctx = stageCanvas.ctx;
  const scale = stageCanvas.getScale();

  // Draw dino at (-210, 0)
  const dinoPos = stageCanvas.toCanvas(-210, 0);
  drawDino(ctx, dinoPos.x, dinoPos.y, scale * 1.5, false, 0);

  // Draw tree at (180, 0)
  const treePos = stageCanvas.toCanvas(180, 0);
  drawTree(ctx, treePos.x, treePos.y, scale * 1.5);

  // Label dino
  ctx.font = '700 11px Space Grotesk, monospace';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  ctx.fillText('(-210, 0)', dinoPos.x, dinoPos.y + 30 * scale);

  // Label tree
  ctx.fillText('(180, 0)', treePos.x, treePos.y + 30 * scale);
}

// ==========================================
// SECTION 4: JUMP DEMO
// ==========================================
let jumpCanvas;
let jumpState = {
  y: 0,
  vy: 0,
  isJumping: false,
  frame: 0,
  animId: null
};

function initJumpDemo() {
  jumpCanvas = new CartesianCanvas('jump-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true, showGround: true,
    onResize: drawJumpDemo
  });
  drawJumpDemo();
  requestAnimationFrame(() => {
    if (jumpCanvas) {
      jumpCanvas.resize();
      drawJumpDemo();
    }
  });

  document.getElementById('btn-jump').addEventListener('click', startJump);
  document.getElementById('btn-jump-reset').addEventListener('click', resetJump);
}

function startJump() {
  if (jumpState.isJumping) return;
  if (!sound.ctx) sound.init();
  sound.play('jump');
  jumpState.isJumping = true;
  jumpState.vy = 8;
  jumpState.frame = 0;
  animateJump();
}

function animateJump() {
  jumpState.y += jumpState.vy;
  jumpState.vy -= 0.35;

  if (jumpState.y <= 0) {
    jumpState.y = 0;
    jumpState.vy = 0;
    jumpState.isJumping = false;
  }

  jumpState.frame++;
  drawJumpDemo();
  updateJumpUI();

  if (jumpState.isJumping) {
    jumpState.animId = requestAnimationFrame(animateJump);
  }
}

function drawJumpDemo() {
  if (!jumpCanvas) return;
  jumpCanvas.draw();
  const ctx = jumpCanvas.ctx;
  const scale = jumpCanvas.getScale();

  const dinoY = Math.round(jumpState.y);
  const dinoPos = jumpCanvas.toCanvas(-210, dinoY);
  drawDino(ctx, dinoPos.x, dinoPos.y, scale * 1.5, jumpState.isJumping, jumpState.frame);

  // Tree static
  const treePos = jumpCanvas.toCanvas(180, 0);
  drawTree(ctx, treePos.x, treePos.y, scale * 1.5);

  // Coord label
  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  const labelY = Math.min(dinoPos.y + 35 * scale, jumpCanvas.toCanvas(0, -jumpCanvas.yRange + 20).y);
  ctx.fillText(`(-210, ${dinoY})`, dinoPos.x, labelY);
}

function updateJumpUI() {
  const dinoY = Math.round(jumpState.y);
  document.getElementById('jump-x').textContent = -210;
  document.getElementById('jump-y').textContent = dinoY;

  // Highlight trajectory values
  const steps = [0, 50, 100, 150, 100, 50, 0];
  let closestIdx = 0;
  let closestDist = Infinity;
  steps.forEach((s, i) => {
    const dist = Math.abs(dinoY - s);
    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = i;
    }
  });

  document.querySelectorAll('.traj-val').forEach((el, i) => {
    el.classList.toggle('active', i === closestIdx);
  });
}

function resetJump() {
  if (jumpState.animId) cancelAnimationFrame(jumpState.animId);
  jumpState.y = 0;
  jumpState.vy = 0;
  jumpState.isJumping = false;
  jumpState.frame = 0;
  drawJumpDemo();
  updateJumpUI();
  document.querySelectorAll('.traj-val').forEach(el => el.classList.remove('active'));
}

// ==========================================
// SECTION 5: TREE MOVEMENT
// ==========================================
let treeCanvas;
let treeState = {
  x: 180,
  playing: false,
  speed: 1,
  animId: null,
  frame: 0
};

function initTreeMovement() {
  treeCanvas = new CartesianCanvas('tree-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true, showGround: true,
    onResize: drawTreeMovement
  });
  drawTreeMovement();
  requestAnimationFrame(() => {
    if (treeCanvas) {
      treeCanvas.resize();
      drawTreeMovement();
    }
  });

  document.getElementById('btn-tree-play').addEventListener('click', () => {
    treeState.playing = true;
    animateTreeMovement();
  });
  document.getElementById('btn-tree-pause').addEventListener('click', () => {
    treeState.playing = false;
    if (treeState.animId) cancelAnimationFrame(treeState.animId);
  });
  document.getElementById('btn-tree-reset').addEventListener('click', () => {
    treeState.playing = false;
    treeState.x = 180;
    if (treeState.animId) cancelAnimationFrame(treeState.animId);
    drawTreeMovement();
    updateTreeUI();
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const speedMap = { slow: 0.4, normal: 1, fast: 2.5 };
      treeState.speed = speedMap[btn.dataset.speed] || 1;
      sound.play('click');
    });
  });
}

function animateTreeMovement() {
  if (!treeState.playing) return;

  treeState.x -= treeState.speed;
  if (treeState.x <= -180) {
    treeState.x = 180;
  }

  treeState.frame++;
  drawTreeMovement();
  updateTreeUI();

  treeState.animId = requestAnimationFrame(animateTreeMovement);
}

function drawTreeMovement() {
  if (!treeCanvas) return;
  treeCanvas.draw();
  const ctx = treeCanvas.ctx;
  const scale = treeCanvas.getScale();

  const treeX = Math.round(treeState.x);
  const treePos = treeCanvas.toCanvas(treeX, 0);
  drawTree(ctx, treePos.x, treePos.y, scale * 1.5);

  // Dino static
  const dinoPos = treeCanvas.toCanvas(-210, 0);
  drawDino(ctx, dinoPos.x, dinoPos.y, scale * 1.5, false, treeState.frame);

  // Arrow showing movement direction
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(treePos.x + 20, treePos.y - 30 * scale);
  ctx.lineTo(treePos.x - 40, treePos.y - 30 * scale);
  ctx.stroke();
  ctx.setLineDash([]);
  // Arrow head
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  ctx.moveTo(treePos.x - 40, treePos.y - 30 * scale);
  ctx.lineTo(treePos.x - 32, treePos.y - 34 * scale);
  ctx.lineTo(treePos.x - 32, treePos.y - 26 * scale);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  ctx.fillText(`(${treeX}, 0)`, treePos.x, treePos.y + 30 * scale);
}

function updateTreeUI() {
  document.getElementById('tree-move-x').textContent = Math.round(treeState.x);
  document.getElementById('tree-move-y').textContent = 0;
}

// ==========================================
// SECTION 6: TIME CONTROL
// ==========================================
let timeCanvas;
let timeState = {
  playing: false,
  currentTime: 0,
  treeX: 180,
  animId: null,
  lastTick: 0
};

function initTimeControl() {
  timeCanvas = new CartesianCanvas('time-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true, showGround: true,
    onResize: drawTimeControl
  });
  drawTimeControl();
  requestAnimationFrame(() => {
    if (timeCanvas) {
      timeCanvas.resize();
      drawTimeControl();
    }
  });

  document.getElementById('btn-time-play').addEventListener('click', startTimeAnimation);
}

function startTimeAnimation() {
  if (timeState.playing) return;
  timeState.playing = true;
  timeState.currentTime = 0;
  timeState.treeX = 180;
  timeState.lastTick = performance.now();
  animateTimeControl();
}

function animateTimeControl() {
  if (!timeState.playing) return;

  const now = performance.now();
  const dt = (now - timeState.lastTick) / 1000;
  timeState.lastTick = now;

  timeState.currentTime += dt;
  // Tree goes from 180 to -180 in 4 seconds
  timeState.treeX = 180 - (timeState.currentTime / 4) * 360;

  if (timeState.currentTime >= 4) {
    timeState.currentTime = 4;
    timeState.treeX = -180;
    timeState.playing = false;
  }

  drawTimeControl();
  updateTimeUI();

  if (timeState.playing) {
    timeState.animId = requestAnimationFrame(animateTimeControl);
  }
}

function drawTimeControl() {
  if (!timeCanvas) return;
  timeCanvas.draw();
  const ctx = timeCanvas.ctx;
  const scale = timeCanvas.getScale();

  const treeX = Math.round(timeState.treeX);
  const treePos = timeCanvas.toCanvas(treeX, 0);
  drawTree(ctx, treePos.x, treePos.y, scale * 1.5);

  // Ghost positions
  const positions = [180, 90, 0, -90, -180];
  positions.forEach(px => {
    if (Math.abs(px - treeX) > 20) {
      const gPos = timeCanvas.toCanvas(px, 0);
      ctx.globalAlpha = 0.15;
      drawTree(ctx, gPos.x, gPos.y, scale * 1.2);
      ctx.globalAlpha = 1;
    }
  });

  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  ctx.fillText(`(${treeX}, 0)`, treePos.x, treePos.y + 30 * scale);
}

function updateTimeUI() {
  const t = Math.min(Math.floor(timeState.currentTime), 4);
  document.getElementById('time-counter-value').textContent = t + 's';

  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.classList.toggle('active', i <= t);
  });
}

// ==========================================
// SECTION 7: POSITION CHALLENGE
// ==========================================
let challengeCanvas;
let challengeState = {
  targets: [
    { x: 80, y: 120 }, { x: -100, y: 50 }, { x: 120, y: 100 },
    { x: 0, y: 150 }, { x: -50, y: -100 }, { x: 150, y: 0 },
    { x: -120, y: 80 }, { x: 60, y: -60 }, { x: -80, y: -120 },
    { x: 200, y: -50 }
  ],
  currentIdx: 0,
  score: 0,
  total: 5,
  clickedPos: null
};

function initPositionChallenge() {
  challengeCanvas = new CartesianCanvas('challenge-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true,
    onResize: drawPositionChallenge
  });
  drawPositionChallenge();
  updateChallengeUI();

  requestAnimationFrame(() => {
    if (challengeCanvas) {
      challengeCanvas.resize();
      drawPositionChallenge();
    }
  });

  const canvas = document.getElementById('challenge-canvas');
  canvas.addEventListener('click', onChallengeClick);

  document.getElementById('btn-challenge-new').addEventListener('click', nextChallenge);
}

function shuffleTargets() {
  for (let i = challengeState.targets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [challengeState.targets[i], challengeState.targets[j]] = [challengeState.targets[j], challengeState.targets[i]];
  }
}

function getCurrentTarget() {
  return challengeState.targets[challengeState.currentIdx % challengeState.targets.length];
}

function onChallengeClick(e) {
  if (!challengeCanvas) return;
  const rect = e.target.getBoundingClientRect();
  const scaleX = challengeCanvas.w / rect.width;
  const scaleY = challengeCanvas.h / rect.height;
  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;

  const pos = challengeCanvas.toCartesian(px, py);
  challengeState.clickedPos = pos;

  const target = getCurrentTarget();
  const tolerance = 30;
  const dx = Math.abs(pos.x - target.x);
  const dy = Math.abs(pos.y - target.y);

  const feedback = document.getElementById('challenge-feedback');
  feedback.style.display = 'block';

  if (dx <= tolerance && dy <= tolerance) {
    challengeState.score++;
    feedback.className = 'challenge-feedback neo-card success';
    feedback.innerHTML = '🎉 Muito bem! O Dino está na posição correta!';
    sound.play('success');
    document.getElementById('btn-challenge-new').style.display = 'inline-flex';
  } else {
    feedback.className = 'challenge-feedback neo-card error';
    feedback.innerHTML = `❌ Tente novamente! Você clicou em (${pos.x}, ${pos.y}). Observe os valores de X e Y.`;
    sound.play('collision');
  }

  drawPositionChallenge();
  updateChallengeUI();
}

function nextChallenge() {
  challengeState.currentIdx++;
  challengeState.clickedPos = null;
  document.getElementById('challenge-feedback').style.display = 'none';
  document.getElementById('btn-challenge-new').style.display = 'none';

  if (challengeState.score >= challengeState.total) {
    challengeState.score = 0;
    challengeState.currentIdx = 0;
    shuffleTargets();
    sound.play('complete');
  }

  drawPositionChallenge();
  updateChallengeUI();
}

function drawPositionChallenge() {
  if (!challengeCanvas) return;
  challengeCanvas.highlightPoint = null;
  challengeCanvas.draw();
  const ctx = challengeCanvas.ctx;
  const scale = challengeCanvas.getScale();

  // Show target as clearly visible dashed circle + crosshair by default
  const target = getCurrentTarget();
  const tp = challengeCanvas.toCanvas(target.x, target.y);

  // Target outer circle
  ctx.save();
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.arc(tp.x, tp.y, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Target center point
  ctx.fillStyle = '#ef476f';
  ctx.beginPath();
  ctx.arc(tp.x, tp.y, 5, 0, Math.PI * 2);
  ctx.fill();

  // Target coordinate label above target
  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#ef476f';
  ctx.textAlign = 'center';
  ctx.fillText(`Alvo: (${target.x}, ${target.y})`, tp.x, tp.y - 28);
  ctx.restore();

  // Dino position: by default visible at (0, 0) if not yet clicked, or at clicked position
  const dinoPos = challengeState.clickedPos || { x: 0, y: 0 };
  const cp = challengeCanvas.toCanvas(dinoPos.x, dinoPos.y);
  drawDino(ctx, cp.x, cp.y, scale * 1.3, false, 0);

  // Dino coordinate label
  ctx.save();
  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'center';
  const dinoLabel = challengeState.clickedPos
    ? `Dino: (${dinoPos.x}, ${dinoPos.y})`
    : `Dino (Origem): (${dinoPos.x}, ${dinoPos.y})`;
  ctx.fillText(dinoLabel, cp.x, cp.y - 18);
  ctx.restore();

  // If clicked, also show visual success/error marker at target
  if (challengeState.clickedPos) {
    const tolerance = 30;
    const dx = Math.abs(challengeState.clickedPos.x - target.x);
    const dy = Math.abs(challengeState.clickedPos.y - target.y);
    const isSuccess = dx <= tolerance && dy <= tolerance;

    ctx.save();
    ctx.fillStyle = isSuccess ? '#06d6a0' : '#ef476f';
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function updateChallengeUI() {
  const target = getCurrentTarget();
  document.getElementById('challenge-target-coords').textContent = `(${target.x}, ${target.y})`;
  document.getElementById('challenge-score').textContent = challengeState.score;
  document.getElementById('challenge-total').textContent = challengeState.total;
}

// ==========================================
// SECTION 8: TREE CHALLENGE
// ==========================================
let treeChallengeCanvas;
let treeChallengeState = {
  targetX: -150,
  currentX: 180,
  targets: [-150, 100, -60, 200, -200, 0, 120, -90]
};

function initTreeChallenge() {
  treeChallengeCanvas = new CartesianCanvas('tree-challenge-canvas', {
    xRange: 240, yRange: 180, showGrid: true, showLabels: true, showGround: true,
    onResize: drawTreeChallenge
  });
  drawTreeChallenge();
  updateTreeChallengeTarget();

  requestAnimationFrame(() => {
    if (treeChallengeCanvas) {
      treeChallengeCanvas.resize();
      drawTreeChallenge();
    }
  });

  const slider = document.getElementById('tree-slider');
  slider.addEventListener('input', () => {
    treeChallengeState.currentX = parseInt(slider.value);
    document.getElementById('tree-slider-value').textContent = treeChallengeState.currentX;
    drawTreeChallenge();
  });

  document.getElementById('btn-tree-challenge-check').addEventListener('click', checkTreeChallenge);

  drawTreeChallenge();
  updateTreeChallengeTarget();
}

function drawTreeChallenge() {
  if (!treeChallengeCanvas) return;
  treeChallengeCanvas.draw();
  const ctx = treeChallengeCanvas.ctx;
  const scale = treeChallengeCanvas.getScale();

  // Tree at current X
  const treePos = treeChallengeCanvas.toCanvas(treeChallengeState.currentX, 0);
  drawTree(ctx, treePos.x, treePos.y, scale * 1.5);

  // Target marker
  const targetPos = treeChallengeCanvas.toCanvas(treeChallengeState.targetX, 0);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(targetPos.x, treeChallengeCanvas.padding);
  ctx.lineTo(targetPos.x, treeChallengeCanvas.h - treeChallengeCanvas.padding);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '700 12px Space Grotesk, monospace';
  ctx.fillStyle = '#ef476f';
  ctx.textAlign = 'center';
  ctx.fillText(`Alvo: X = ${treeChallengeState.targetX}`, targetPos.x, treeChallengeCanvas.padding - 6);

  // Label current
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(`(${treeChallengeState.currentX}, 0)`, treePos.x, treePos.y + 30 * scale);
}

function checkTreeChallenge() {
  const tolerance = 15;
  const feedback = document.getElementById('tree-challenge-feedback');
  feedback.style.display = 'block';

  if (Math.abs(treeChallengeState.currentX - treeChallengeState.targetX) <= tolerance) {
    feedback.className = 'challenge-feedback neo-card success';
    feedback.innerHTML = `🎉 Acertou! A árvore está em X = ${treeChallengeState.currentX}.`;
    sound.play('success');

    // New target after delay
    setTimeout(() => {
      const idx = Math.floor(Math.random() * treeChallengeState.targets.length);
      treeChallengeState.targetX = treeChallengeState.targets[idx];
      updateTreeChallengeTarget();
      feedback.style.display = 'none';
      drawTreeChallenge();
    }, 2000);
  } else {
    feedback.className = 'challenge-feedback neo-card error';
    feedback.innerHTML = `❌ A árvore está em X = ${treeChallengeState.currentX}. O alvo é X = ${treeChallengeState.targetX}. Ajuste o controle!`;
    sound.play('collision');
  }
}

function updateTreeChallengeTarget() {
  document.getElementById('tree-challenge-target').textContent = `X = ${treeChallengeState.targetX}`;
}

// ==========================================
// SECTION 10: MINI GAME
// ==========================================
let gameCanvas, gameCtx;
let gameState = {
  running: false,
  dino: { x: -210, y: 0, vy: 0, jumping: false },
  trees: [],
  score: 0,
  frame: 0,
  speed: 3,
  spawnTimer: 0,
  animId: null,
  groundY: 0
};

const GAME_X_RANGE = 240;
const GAME_Y_RANGE = 180;

function initMiniGame() {
  const canvas = document.getElementById('game-canvas');
  gameCtx = canvas.getContext('2d');

  // Set canvas size
  function resizeGameCanvas() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth - 10;
    const h = Math.min(w * 0.6, 420);
    canvas.width = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gameCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    gameCanvas = { w, h, canvas };
    if (!gameState.running) drawGameIdle();
  }

  resizeGameCanvas();
  new ResizeObserver(resizeGameCanvas).observe(canvas.parentElement);

  drawGameIdle();

  document.getElementById('btn-game-start').addEventListener('click', startGame);
  document.getElementById('btn-game-restart').addEventListener('click', startGame);

  // Controls
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && gameState.running) {
      e.preventDefault();
      gameDinoJump();
    }
  });

  canvas.addEventListener('click', () => {
    if (gameState.running) gameDinoJump();
  });

  canvas.addEventListener('touchstart', e => {
    if (gameState.running) {
      e.preventDefault();
      gameDinoJump();
    }
  }, { passive: false });
}

function gameToCanvas(cx, cy) {
  if (!gameCanvas) return { x: 0, y: 0 };
  const padding = 30;
  const px = padding + ((cx + GAME_X_RANGE) / (GAME_X_RANGE * 2)) * (gameCanvas.w - padding * 2);
  const py = padding + ((GAME_Y_RANGE - cy) / (GAME_Y_RANGE * 2)) * (gameCanvas.h - padding * 2);
  return { x: px, y: py };
}

function gameScale() {
  if (!gameCanvas) return 0.5;
  return (gameCanvas.w - 60) / (GAME_X_RANGE * 2) * 0.55;
}

function startGame() {
  if (!sound.ctx) sound.init();
  gameState = {
    running: true,
    dino: { x: -210, y: 0, vy: 0, jumping: false },
    trees: [{ x: 240, y: 0 }],
    score: 0,
    frame: 0,
    speed: 3,
    spawnTimer: 0,
    animId: null,
    groundY: 0
  };

  document.getElementById('game-overlay').style.display = 'none';
  document.getElementById('game-over-overlay').style.display = 'none';

  gameLoop();
}

function gameDinoJump() {
  if (gameState.dino.jumping) return;
  gameState.dino.jumping = true;
  gameState.dino.vy = 9;
  sound.play('jump');
}

function gameLoop() {
  if (!gameState.running) return;

  // Update dino
  if (gameState.dino.jumping) {
    gameState.dino.y += gameState.dino.vy;
    gameState.dino.vy -= 0.4;
    if (gameState.dino.y <= 0) {
      gameState.dino.y = 0;
      gameState.dino.vy = 0;
      gameState.dino.jumping = false;
    }
  }

  // Update trees
  gameState.trees.forEach(tree => {
    tree.x -= gameState.speed;
  });

  // Remove off-screen trees & score
  gameState.trees = gameState.trees.filter(tree => {
    if (tree.x < -250) {
      gameState.score++;
      sound.play('click');
      return false;
    }
    return true;
  });

  // Spawn new trees
  gameState.spawnTimer++;
  const spawnInterval = Math.max(60, 120 - gameState.score * 3);
  if (gameState.spawnTimer >= spawnInterval) {
    gameState.trees.push({ x: 250, y: 0 });
    gameState.spawnTimer = 0;
  }

  // Collision detection
  const dinoHitboxX = gameState.dino.x;
  const dinoHitboxY = gameState.dino.y;
  for (const tree of gameState.trees) {
    const dx = Math.abs(tree.x - dinoHitboxX);
    const hitY = dinoHitboxY < 40;
    if (dx < 30 && hitY) {
      gameOver();
      return;
    }
  }

  // Speed up
  gameState.speed = 3 + gameState.score * 0.2;

  gameState.frame++;
  drawGame();
  updateGameHUD();

  gameState.animId = requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameState.running = false;
  if (gameState.animId) cancelAnimationFrame(gameState.animId);
  sound.play('collision');

  document.getElementById('game-final-score').textContent = gameState.score;
  document.getElementById('game-over-overlay').style.display = 'flex';
}

function drawGame() {
  if (!gameCanvas) return;
  const ctx = gameCtx;
  const { w, h } = gameCanvas;
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, w, h);

  // Mini grid
  const padding = 30;
  ctx.strokeStyle = '#e8e4dc';
  ctx.lineWidth = 0.5;
  for (let gx = -GAME_X_RANGE; gx <= GAME_X_RANGE; gx += 60) {
    const p = gameToCanvas(gx, 0);
    ctx.beginPath(); ctx.moveTo(p.x, padding); ctx.lineTo(p.x, h - padding); ctx.stroke();
  }
  for (let gy = -GAME_Y_RANGE; gy <= GAME_Y_RANGE; gy += 60) {
    const p = gameToCanvas(0, gy);
    ctx.beginPath(); ctx.moveTo(padding, p.y); ctx.lineTo(w - padding, p.y); ctx.stroke();
  }

  // X axis
  const origin = gameToCanvas(0, 0);
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(padding, origin.y); ctx.lineTo(w - padding, origin.y); ctx.stroke();
  // Y axis
  ctx.strokeStyle = '#3a86ff';
  ctx.beginPath(); ctx.moveTo(origin.x, padding); ctx.lineTo(origin.x, h - padding); ctx.stroke();

  // Ground fill
  ctx.fillStyle = 'rgba(85,85,85,0.08)';
  ctx.fillRect(padding, origin.y, w - padding * 2, h - padding - origin.y);

  const scale = gameScale();

  // Trees
  gameState.trees.forEach(tree => {
    const tp = gameToCanvas(tree.x, tree.y);
    drawTree(ctx, tp.x, tp.y, scale * 1.3);
  });

  // Dino
  const dp = gameToCanvas(gameState.dino.x, gameState.dino.y);
  drawDino(ctx, dp.x, dp.y, scale * 1.3, gameState.dino.jumping, gameState.frame);

  // Score display
  ctx.font = '700 16px Space Grotesk, sans-serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'left';
  ctx.fillText(`⭐ ${gameState.score}`, padding + 5, padding + 18);
}

function drawGameIdle() {
  if (!gameCanvas) return;
  const ctx = gameCtx;
  const { w, h } = gameCanvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, w, h);

  const scale = gameScale();
  const dp = gameToCanvas(-210, 0);
  drawDino(ctx, dp.x, dp.y, scale * 1.3, false, 0);

  const tp = gameToCanvas(180, 0);
  drawTree(ctx, tp.x, tp.y, scale * 1.3);
}

function updateGameHUD() {
  document.getElementById('game-dino-x').textContent = Math.round(gameState.dino.x);
  document.getElementById('game-dino-y').textContent = Math.round(gameState.dino.y);
  const treeX = gameState.trees.length > 0 ? Math.round(gameState.trees[0].x) : '—';
  document.getElementById('game-tree-x').textContent = treeX;
  document.getElementById('game-score').textContent = gameState.score;
}

// ==========================================
// SUMMARY CONFETTI
// ==========================================
function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';

  const colors = ['#ff6b35', '#ffd166', '#3a86ff', '#ef476f', '#06d6a0', '#9b5de5'];

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.width = (6 + Math.random() * 8) + 'px';
    confetti.style.height = (6 + Math.random() * 8) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(confetti);
  }
}

// ==========================================
// INTERSECTION OBSERVER FOR LAZY INIT
// ==========================================
const initMap = {
  'explanation': { init: initExplanation, done: false },
  'interactive-stage': { init: initStage, done: false },
  'jump-demo': { init: initJumpDemo, done: false },
  'tree-movement': { init: initTreeMovement, done: false },
  'time-control': { init: initTimeControl, done: false },
  'position-challenge': { init: initPositionChallenge, done: false },
  'tree-challenge': { init: initTreeChallenge, done: false },
  'mini-game': { init: initMiniGame, done: false },
  'summary': { init: () => { spawnConfetti(); sound.play('complete'); }, done: false }
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (initMap[id] && !initMap[id].done) {
        initMap[id].init();
        initMap[id].done = true;
      }
    }
  });
}, { threshold: 0.05 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  animateHeroDino();
  shuffleTargets();

  // Pre-initialize interactive sections so canvases, axes, dino and targets are visible by default
  ['explanation', 'interactive-stage', 'jump-demo', 'tree-movement', 'time-control', 'position-challenge', 'tree-challenge'].forEach(id => {
    if (initMap[id] && !initMap[id].done) {
      initMap[id].init();
      initMap[id].done = true;
    }
  });
});

// Make scrollToSection globally available
window.scrollToSection = scrollToSection;

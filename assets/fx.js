/**
 * Synkyn Studios — FX Engine v3
 * ─────────────────────────────────────────────────────────────
 * Ambient yellow triangle "crystals" rendered on a fixed canvas.
 *
 * Design goals (why this differs from v2):
 *  • The layer must read as BACKGROUND ATMOSPHERE, not an overlay that
 *    sits on top of and muddies the content. It uses `mix-blend-mode:
 *    screen`, so on the dark Synkyn theme it only ADDS light (a soft
 *    gold glow) and never darkens or "overlaps" text/UI underneath.
 *  • Crystals are small and sparse, with low opacity, so readability
 *    is never compromised.
 *  • Crisp on HiDPI/Retina via devicePixelRatio scaling.
 *  • A refined pointer interaction: a smoothed cursor that gently
 *    repels nearby crystals, brightens the ones it passes (a trail of
 *    light), and drives a subtle parallax for depth.
 *  • Performance-aware: capped count, paused when the tab is hidden,
 *    debounced resize, and fully disabled under prefers-reduced-motion.
 *
 * Drop-in replacement for the previous fx.js — no markup changes needed.
 */
(function () {
  'use strict';

  /* ── guard against double-init (hot reload / duplicate include) ── */
  if (window.__synkynFX) return;
  window.__synkynFX = true;

  var REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile detection for smaller crystals
  var IS_MOBILE = window.innerWidth < 768;

  /* ============================================================
     1. CANVAS — fixed ambient layer.
        z-index sits above opaque page sections (~1) so the glow
        is visible over the dark theme, but BELOW the nav (~100)
        and any menu/modal. `screen` blend = additive light only.
  ============================================================ */
  var canvas = document.createElement('canvas');
  canvas.id = 'synkyn-fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '2',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    opacity: '0',
    transition: 'opacity 1.2s ease'
  });
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0; // CSS pixels

  /* ============================================================
     2. POINTER STATE — raw + smoothed (lerped) for buttery motion
  ============================================================ */
  var pointer = {
    x: -9999, y: -9999,   // raw target
    sx: -9999, sy: -9999, // smoothed
    active: false
  };

  window.addEventListener('mousemove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (!pointer.active) {           // first move: snap so nothing jumps
      pointer.sx = pointer.x;
      pointer.sy = pointer.y;
    }
    pointer.active = true;
  }, { passive: true });

  window.addEventListener('mousedown', function (e) {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });

  document.addEventListener('mouseleave', function () { pointer.active = false; });
  window.addEventListener('blur', function () { pointer.active = false; });

  // Touch: let a finger nudge crystals too.
  window.addEventListener('touchmove', function (e) {
    if (!e.touches || !e.touches.length) return;
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
    if (!pointer.active) { pointer.sx = pointer.x; pointer.sy = pointer.y; }
    pointer.active = true;
  }, { passive: true });
  window.addEventListener('touchend', function () { pointer.active = false; });

  /* ============================================================
     3. CRYSTAL (triangle) — each carries a depth for parallax,
        sizing, speed and base brightness.
  ============================================================ */
  var PALETTE = ['#f2c200', '#ffd84d', '#ffe375', '#e8b800', '#fff4a3'];

  // Interaction radii (CSS px).
  var REPEL_R = 250;   // push away (increased for stronger reaction)
  var GLOW_R = 250;   // brighten / enlarge

  function Crystal(scatter) { this.reset(scatter); }

  Crystal.prototype.reset = function (scatter) {
    this.depth = 0.35 + Math.random() * 0.65;          // 0.35 (far) → 1 (near)
    var d = this.depth;

    // mobile: reduced by half per request; desktop: ~1.2–6px
    this.size = IS_MOBILE ? (0.3 + d * 1.0) : (1.2 + d * 4.8);

    this.x = Math.random() * W;
    this.y = scatter ? Math.random() * H : H + this.size + 6;

    // fast diagonal upward drift
    this.vx = (1.5 + Math.random() * 1.0) * (0.8 + d);
    this.vy = -(1.5 + Math.random() * 1.0) * (0.8 + d);

    this.rot = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.009;

    // base opacity tied to depth (far = fainter) — kept low so crystals
    // never obscure text. Mobile gets even lower opacity.
    this.baseA = IS_MOBILE
      ? (0.03 + Math.random() * 0.10) * (0.35 + d * 0.45)
      : (0.04 + Math.random() * 0.16) * (0.40 + d * 0.50);
    this.a = this.baseA;

    this.color = PALETTE[(Math.random() * PALETTE.length) | 0];
    this.glow = Math.random() < 0.14;                 // a few brighter ones
    this.phase = Math.random() * Math.PI * 2;
    this.phV = 0.012 + Math.random() * 0.018;

    // transient interaction boosts (eased back to 0 each frame)
    this.boost = 0;   // brightness/size boost near cursor
  };

  Crystal.prototype.update = function (parX, parY) {
    var d = this.depth;

    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    this.phase += this.phV;

    // ── pointer interaction ──
    if (pointer.active) {
      var dx = this.x - pointer.sx;
      var dy = this.y - pointer.sy;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < GLOW_R && dist > 0.001) {
        // proximity glow: nearer crystals light up more
        var g = (GLOW_R - dist) / GLOW_R;
        this.boost = Math.max(this.boost, g * (0.6 + d * 0.6));
      }
      if (dist < REPEL_R && dist > 0.001) {
        // strong repel, scaled by depth so the field has parallax weight
        var f = ((REPEL_R - dist) / REPEL_R);
        f = f * f;                       // ease — strongest only when close
        this.vx += (dx / dist) * f * 2.5 * d; // increased force multiplier
        this.vy += (dy / dist) * f * 2.5 * d;
      }
    }

    // ease the boost back down
    this.boost *= 0.92;

    // damping + restore diagonal upward bias
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.vx += 0.12 * (0.8 + d);
    this.vy -= 0.12 * (0.8 + d);

    // respawn once fully off-screen (account for parallax offset)
    var m = this.size + 16;
    var px = this.x + parX * d;
    var py = this.y + parY * d;
    if (py < -m || px < -m || px > W + m || py > H + m) {
      this.reset(false);
    }
  };

  Crystal.prototype.draw = function (parX, parY) {
    var pulse = 0.5 + 0.5 * Math.sin(this.phase);
    var glowPulse = this.glow ? (0.7 + 0.3 * pulse) : 1;
    var alpha = (this.a * glowPulse) + this.boost * 0.5;
    if (alpha <= 0.004) return;
    if (alpha > (IS_MOBILE ? 0.40 : 0.55)) alpha = IS_MOBILE ? 0.40 : 0.55;

    var s = this.size * (1 + this.boost * 0.35);

    // parallax: nearer crystals shift more with the cursor → depth
    var x = this.x + parX * this.depth;
    var y = this.y + parY * this.depth;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = alpha;

    if (this.glow || this.boost > 0.15) {
      ctx.shadowColor = '#ffcf2e';
      ctx.shadowBlur = (this.glow ? 6 : 0) + this.boost * 14 + 4 * pulse;
    }

    // equilateral-ish triangle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.866, s * 0.5);
    ctx.lineTo(-s * 0.866, s * 0.5);
    ctx.closePath();
    ctx.fill();

    // crisp edge highlight
    ctx.shadowBlur = 0;
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = '#fffbe6';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  };

  /* ============================================================
     4. INIT / RESIZE (debounced) with DPR scaling
  ============================================================ */
  var crystals = [];

  function sizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // draw in CSS px, render at DPR
  }

  function targetCount() {
    // 2× population: one crystal per ~8.5k css px², clamped
    return Math.max(68, Math.min(180, Math.floor((W * H) / 8500)));
  }

  function build() {
    IS_MOBILE = window.innerWidth < 768; // re-check on resize/build
    sizeCanvas();
    var n = targetCount();
    crystals = [];
    for (var i = 0; i < n; i++) crystals.push(new Crystal(true));
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 180);
  }, { passive: true });

  /* ============================================================
     5. LOOP — with smoothed pointer + global parallax offset,
        paused while the tab is hidden.
  ============================================================ */
  var running = true;

  function loop() {
    if (!running) return;

    // smooth the pointer
    if (pointer.active) {
      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.sy += (pointer.y - pointer.sy) * 0.12;
    }

    // global parallax target: field leans gently opposite the cursor
    var parX = 0, parY = 0;
    if (pointer.active) {
      parX = ((W * 0.5) - pointer.sx) / (W * 0.5) * 14; // ±14px
      parY = ((H * 0.5) - pointer.sy) / (H * 0.5) * 14;
    }

    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < crystals.length; i++) {
      crystals[i].update(parX, parY);
      crystals[i].draw(parX, parY);
    }
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });

  /* ============================================================
     6. BOOT (respect reduced motion)
  ============================================================ */
  function start() {
    if (REDUCED) { canvas.style.display = 'none'; return; }
    build();
    requestAnimationFrame(function () {
      canvas.style.opacity = '1';
      loop();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // react if the user toggles reduced-motion at runtime
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mq) {
    var onChange = function (e) {
      if (e.matches) { running = false; canvas.style.display = 'none'; }
      else { canvas.style.display = ''; if (!running) { running = true; build(); canvas.style.opacity = '1'; requestAnimationFrame(loop); } }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

})();
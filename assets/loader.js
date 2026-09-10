/*
  Synkyn Studios — Loading Controller
  Copyright (c) 2026 Synkyn Studios. All rights reserved.

  WHAT CHANGED
  ------------
  The old controller ran a hardcoded timetable: 35% at 150ms, 70% at 320ms,
  and so on, regardless of whether anything had actually loaded. The number
  was decoration.

  This one reads five real signals and weights them:

      DOM parsed .............. 20%   document.readyState
      Sub-resources ........... 25%   PerformanceObserver resource entries
      Images .................. 20%   fraction of <img> with .complete
      Web fonts ............... 10%   document.fonts.ready
      window load ............. 25%   the load event

  The displayed value eases toward that target and is monotonic — it can rise
  and stall, never fall, because a counter that jumps backwards reads as a
  bug. A slow creep keeps it ticking during a stall so the page never looks
  frozen, and it is held below 99% until the signals genuinely finish.

  MIN_MS stops the loader flashing past on a warm cache. MAX_MS is a hard
  ceiling — the loader can never hold the page hostage, whatever fails.
*/

(function () {
    'use strict';

    var root = document.documentElement;
    var loader = document.getElementById('synkynLoader');

    function kill() {
        root.classList.remove('show-loader');
        root.classList.add('hide-loader');
        if (loader) {
            loader.hidden = true;
            loader.classList.add('is-hidden');
        }
        try {
            document.dispatchEvent(new CustomEvent('synkyn:loaderdone'));
        } catch (e) { }
    }

    if (!loader) {
        kill();
        return;
    }

    // Ensure loader and root are in active loading state
    root.classList.add('show-loader');
    root.classList.remove('hide-loader');
    if (loader.hidden) loader.hidden = false;
    loader.classList.remove('is-hidden', 'open', 'is-complete');

    var pctEl = loader.querySelector('.loader-pct');
    var barEl = loader.querySelector('.loader-bar');

    var MIN_MS = 1400;   // allows smooth sequential progression to 100%
    var MAX_MS = 3800;   // hard ceiling — prevents getting trapped on slow/blocked external CDNs
    var startTime = performance.now();
    var lastNow = startTime;
    var finished = false;

    // Initial paint at 01%
    paint(0.01);

    /* ======================================================================
       REAL LOADING SIGNALS
       ====================================================================== */
    var WEIGHT = {
        dom: 0.15,
        res: 0.20,
        img: 0.20,
        font: 0.10,
        vimeo: 0.20,
        load: 0.15
    };

    var sig = {
        dom: 0,
        res: 0,
        img: 0,
        font: 0,
        vimeo: 0,
        load: 0
    };

    /* --- 1. DOM Readiness --- */
    function readDom() {
        if (document.readyState === 'complete') return 1;
        if (document.readyState === 'interactive') return 0.85;
        return document.body ? 0.45 : 0.2;
    }

    /* --- 2. Sub-resources (CSS, JS, Fonts) --- */
    var resCount = 0;
    var RES_K = 18;

    if (window.PerformanceObserver) {
        try {
            var po = new PerformanceObserver(function (list) {
                resCount += list.getEntries().length;
            });
            po.observe({ type: 'resource', buffered: true });
        } catch (e) { }
    }
    if (!resCount && window.performance && performance.getEntriesByType) {
        try {
            resCount = performance.getEntriesByType('resource').length;
        } catch (e) { }
    }

    function readRes() {
        if (sig.load === 1) return 1;
        return resCount / (resCount + RES_K);
    }

    /* --- 3. Critical Images --- */
    function readImg() {
        var imgs = document.images;
        var n = imgs.length;
        if (!n) return document.readyState === 'loading' ? 0.2 : 1;
        var done = 0;
        for (var i = 0; i < n; i++) {
            if (imgs[i].complete) done++;
        }
        return done / n;
    }

    /* --- 4. Web Fonts --- */
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { sig.font = 1; }).catch(function () { sig.font = 1; });
    } else {
        sig.font = 1;
    }

    /* --- 5. Hero Vimeo Player --- */
    var vimeoFrame = document.querySelector('.hero-bg-iframe');
    if (!vimeoFrame) {
        sig.vimeo = 1;
    } else {
        // Iframe document loaded
        vimeoFrame.addEventListener('load', function () {
            sig.vimeo = Math.max(sig.vimeo, 0.7);
        }, { once: true });

        // Coordinated event from hero-video.js
        document.addEventListener('synkyn:vimeoready', function () {
            sig.vimeo = 1;
        }, { once: true });

        // Vimeo player postMessage signals
        function onVimeoMsg(e) {
            if (!e || !e.data) return;
            try {
                var d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                if (d && (d.event === 'ready' || d.event === 'play' || d.event === 'playing')) {
                    sig.vimeo = 1;
                    window.removeEventListener('message', onVimeoMsg);
                }
            } catch (err) { }
        }
        window.addEventListener('message', onVimeoMsg);

        // Grace fallback for slow or ad-blocked Vimeo embed
        setTimeout(function () {
            sig.vimeo = 1;
        }, 3200);
    }

    /* --- 6. Window Load --- */
    if (document.readyState === 'complete') {
        sig.load = 1;
    } else {
        window.addEventListener('load', function () {
            sig.load = 1;
        }, { once: true });
    }

    function targetProgress() {
        sig.dom = Math.max(sig.dom, readDom());
        sig.res = Math.max(sig.res, readRes());
        sig.img = Math.max(sig.img, readImg());

        var sum = sig.dom * WEIGHT.dom
            + sig.res * WEIGHT.res
            + sig.img * WEIGHT.img
            + sig.font * WEIGHT.font
            + sig.vimeo * WEIGHT.vimeo
            + sig.load * WEIGHT.load;

        return Math.max(0.01, Math.min(1.0, sum));
    }

    function isCriticalReady() {
        return (sig.load === 1 || sig.dom === 1) && sig.font === 1 && sig.img >= 0.90 && sig.vimeo >= 0.7;
    }

    /* ======================================================================
       SMOOTH CONTINUOUS RENDER LOOP (01% -> 100% STRICT SEQUENTIAL)
       ====================================================================== */
    var shown = 0.01;
    var displayedPct = 1;

    function paint(v) {
        // Synchronized CSS custom property for bar & seam
        loader.style.setProperty('--loader-progress', v.toFixed(4));
        
        // Target integer from progress
        var targetPct = Math.max(1, Math.min(100, Math.floor(v * 100)));

        // Strict sequential increment: smooth count-up with responsive catch-up if needed
        var delta = targetPct - displayedPct;
        if (delta > 0) {
            var step = delta > 10 ? Math.ceil(delta / 5) : 1;
            displayedPct = Math.min(100, displayedPct + step);
        }

        var pctStr = (displayedPct < 10 ? '0' : '') + displayedPct + '%';

        if (pctEl && pctEl.textContent !== pctStr) {
            pctEl.textContent = pctStr;
        }
        if (barEl) {
            barEl.setAttribute('aria-valuenow', String(displayedPct));
        }
    }

    function frame(now) {
        if (finished) return;

        var dt = Math.min(50, Math.max(8, now - lastNow));
        lastNow = now;
        var elapsed = now - startTime;

        var rawT = targetProgress();
        var allDone = isCriticalReady() || elapsed >= MAX_MS;

        // Target is held below 0.99 until critical assets are genuinely ready
        var t = allDone ? 1.0 : Math.min(0.99, rawT);

        var diff = t - shown;

        if (diff > 0) {
            var timeScale = dt / 16.67;

            // Proportional step + gentle baseline creep to never freeze
            var step = (diff * 0.05 + 0.0004) * timeScale;

            // Fluid rate limiting: smoothly glide without sudden spikes
            var maxStep = allDone ? (0.024 * timeScale) : (0.010 * timeScale);
            var minStep = (allDone ? 0.003 : 0.001) * timeScale;

            step = Math.max(minStep, Math.min(maxStep, step));
            shown += step;

            if (allDone && shown >= 0.992) {
                shown = 1.0;
            } else if (!allDone && shown > 0.99) {
                shown = 0.99;
            }
        }

        paint(shown);

        // Completion trigger once displayed percentage has smoothly traversed all the way to 100%
        if (allDone && displayedPct >= 100 && elapsed >= MIN_MS) {
            complete();
            return;
        }

        requestAnimationFrame(frame);
    }

    function complete() {
        if (finished) return;
        finished = true;

        // Force exactly 100% state
        displayedPct = 100;
        loader.style.setProperty('--loader-progress', '1');
        if (pctEl) pctEl.textContent = '100%';
        if (barEl) barEl.setAttribute('aria-valuenow', '100');

        loader.classList.add('is-complete');

        // Confidently showcase the 100% completed state (gold bloom, full seam & bar)
        // so the user clearly registers and sees 100% before the split panels reveal the page
        setTimeout(function () {
            loader.classList.add('open');
            setTimeout(kill, 950);
        }, 380);
    }

    requestAnimationFrame(frame);

    // Absolute backstop to ensure user is never trapped, but still smoothly completes to 100%
    setTimeout(function () {
        if (!finished) {
            var stepInterval = setInterval(function () {
                if (finished) {
                    clearInterval(stepInterval);
                    return;
                }
                if (displayedPct < 100) {
                    displayedPct += 1;
                    var pctStr = (displayedPct < 10 ? '0' : '') + displayedPct + '%';
                    if (pctEl) pctEl.textContent = pctStr;
                    if (barEl) barEl.setAttribute('aria-valuenow', String(displayedPct));
                    loader.style.setProperty('--loader-progress', (displayedPct / 100).toFixed(4));
                } else {
                    clearInterval(stepInterval);
                    complete();
                }
            }, 16);
        }
    }, MAX_MS);

    /* ======================================================================
       AMBIENT GOLD PARTICLES
       ====================================================================== */
    (function () {
        var canvas = loader.querySelector('.loader-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var dpr = Math.min(2, window.devicePixelRatio || 1);
        var W, H, flakes = [], running = true;
        var COUNT = Math.min(60, Math.round(window.innerWidth / 18));

        function resize() {
            W = window.innerWidth * dpr;
            H = window.innerHeight * dpr;
            canvas.width = W;
            canvas.height = H;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
        }

        function make() {
            flakes = [];
            for (var i = 0; i < COUNT; i++) {
                flakes.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    s: (Math.random() * 2.8 + 1.2) * dpr,
                    vx: (Math.random() * 1.0 + 0.3) * dpr,
                    vy: (-Math.random() * 0.8 - 0.2) * dpr,
                    a: Math.random() * 0.28 + 0.08,
                    rot: Math.random() * Math.PI * 2,
                    vr: (Math.random() * 0.04 - 0.02),
                    w: Math.random() * Math.PI * 2,
                    vw: Math.random() * 0.04 + 0.01
                });
            }
        }

        function tri(x, y, s, rot, alpha) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#f2d400';
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s, s);
            ctx.lineTo(-s, s);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function loop() {
            if (!running || loader.hidden || finished) {
                running = false;
                return;
            }
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < flakes.length; i++) {
                var f = flakes[i];
                f.w += f.vw;
                f.x += f.vx;
                f.y += f.vy + Math.sin(f.w) * 0.4 * dpr;
                f.rot += f.vr;
                if (f.x > W + 10) f.x = -10;
                if (f.y < -10) f.y = H + 10;
                tri(f.x, f.y, f.s, f.rot, f.a);
            }
            requestAnimationFrame(loop);
        }

        resize();
        make();
        loop();

        var rt;
        window.addEventListener('resize', function () {
            clearTimeout(rt);
            rt = setTimeout(function () { resize(); make(); }, 200);
        }, { passive: true });

        document.addEventListener('visibilitychange', function () {
            running = !document.hidden && !finished;
            if (running) requestAnimationFrame(loop);
        });
    })();
})();
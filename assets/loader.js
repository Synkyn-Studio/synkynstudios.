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

    // The head script did not opt in — internal navigation, repeat visit, or
    // reduced motion. The CSS already has this at display:none.
    if (!loader || !root.classList.contains('show-loader')) {
        kill();
        return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        kill();
        return;
    }

    var pctEl = loader.querySelector('.loader-pct');
    var barEl = loader.querySelector('.loader-bar');

    var MIN_MS = 1100;   // never shorter than this — avoids a jarring flash
    var MAX_MS = 5000;   // never longer than this, no matter what stalls
    var startTime = performance.now();
    var finished = false;

    /* ======================================================================
       SIGNALS
       ====================================================================== */
    var WEIGHT = { dom: 0.20, res: 0.25, img: 0.20, font: 0.10, load: 0.25 };

    var sig = { dom: 0, res: 0, img: 0, font: 0, load: 0 };

    /* --- DOM parsed --- */
    function readDom() {
        if (document.readyState === 'complete') return 1;
        if (document.readyState === 'interactive') return 1;
        return document.body ? 0.4 : 0;
    }

    /* --- Sub-resources -------------------------------------------------
       We cannot know the total up front, so count what has arrived and map
       it through count / (count + K). That asymptotes toward 1: honest about
       direction of travel without pretending to know the denominator. --- */
    var resCount = 0;
    var RES_K = 20;

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

    /* --- Images --- */
    function readImg() {
        var imgs = document.images;
        var n = imgs.length;
        if (!n) return document.readyState === 'loading' ? 0 : 1;
        var done = 0;
        for (var i = 0; i < n; i++) {
            if (imgs[i].complete) done++;
        }
        return done / n;
    }

    /* --- Web fonts --- */
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { sig.font = 1; }).catch(function () { sig.font = 1; });
    } else {
        sig.font = 1;
    }

    /* --- window load --- */
    if (document.readyState === 'complete') {
        sig.load = 1;
    } else {
        window.addEventListener('load', function () { sig.load = 1; }, { once: true });
    }

    function target() {
        sig.dom = Math.max(sig.dom, readDom());
        sig.res = Math.max(sig.res, readRes());
        sig.img = Math.max(sig.img, readImg());

        return sig.dom * WEIGHT.dom
            + sig.res * WEIGHT.res
            + sig.img * WEIGHT.img
            + sig.font * WEIGHT.font
            + sig.load * WEIGHT.load;
    }

    function allSettled() {
        return sig.load === 1 && sig.font === 1 && sig.img >= 0.999 && sig.dom === 1;
    }

    /* ======================================================================
       RENDER LOOP
       ====================================================================== */
    var shown = 0;          // 0 to 1, monotonic
    var LERP = 0.10;
    var CREEP = 0.00035;    // keeps the number alive during a stall
    var CEILING = 0.99;     // never show 100% until the page really is ready

    function paint(v) {
        loader.style.setProperty('--loader-progress', v.toFixed(4));
        var pct = Math.round(v * 100);
        if (pctEl) pctEl.textContent = (pct < 10 ? '0' : '') + pct + '%';
        if (barEl) barEl.setAttribute('aria-valuenow', String(pct));
    }

    function frame(now) {
        if (finished) return;

        var elapsed = now - startTime;
        var t = target();

        shown += (t - shown) * LERP;
        if (t - shown < 0.004 && shown < 0.92) shown += CREEP;

        var settled = allSettled();
        var cap = settled ? 1 : CEILING;
        if (shown > cap) shown = cap;

        paint(shown);

        if (elapsed >= MAX_MS || (settled && elapsed >= MIN_MS && shown > 0.985)) {
            complete();
            return;
        }

        requestAnimationFrame(frame);
    }

    function complete() {
        if (finished) return;
        finished = true;

        paint(1);
        loader.classList.add('is-complete');

        // Let the seam flare and reach full width before the panels part.
        setTimeout(function () {
            loader.classList.add('open');
            setTimeout(kill, 1000);   // 140ms delay + 760ms split + margin
        }, 380);
    }

    requestAnimationFrame(frame);

    // Absolute backstop, independent of the rAF loop. If the tab is
    // backgrounded, rAF pauses and the loop above stops running entirely.
    setTimeout(function () {
        if (!finished) complete();
    }, MAX_MS + 200);

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
/*
  Synkyn Studios — Hero Background Video Controller
  Copyright (c) 2026 Synkyn Studios. All rights reserved.

  ─────────────────────────────────────────────────────────────────────────
  READ THIS FIRST — one thing in the brief is not physically possible
  ─────────────────────────────────────────────────────────────────────────
  A normal link click between two .html files is a full document navigation.
  The browser tears down the entire document: DOM, iframes, JS heap, decoded
  media, everything. No storage API can survive that with a LIVE object.
  sessionStorage, localStorage and IndexedDB hold serialisable data — strings
  and numbers. There is no way to put a running cross-origin Vimeo player
  into storage on Library and take it back out on Home. It does not exist as
  a capability in any browser.

  So "keep the loaded player alive across navigation" cannot be done as
  literally stated on a multi-page site. What CAN be done is make the delay
  invisible and make the reload as close to free as possible. That is what
  this file does, on four fronts:

    1. POSTER-FIRST. A still frame paints immediately, so the hero is never
       black or empty. The iframe fades in over it once the player is
       actually rendering. This removes the *perceived* delay entirely —
       which is the thing you actually see.

    2. BFCACHE. If the visitor uses the Back button, the browser restores
       the whole page from memory with the iframe still alive and playing.
       Verified: nothing in this codebase registers `unload` or
       `beforeunload`, so the page is bfcache-eligible. The `pageshow`
       handler below detects that restore and skips all re-initialisation.

    3. WARM-SESSION FLAG. sessionStorage cannot store the player, but it can
       store the knowledge that Vimeo's player.js, CSS and first segments are
       already in the HTTP cache. On a return visit the reveal is immediate
       instead of using the cautious first-load timing.

    4. ONE PLAYER, EVER. The old markup had two iframes — .hero-bg-desktop
       and .hero-bg-mobile — pointing at the identical URL with identical
       parameters, so the split saved nothing. Worse, resizing across the
       breakpoint assigned src to the second without clearing the first,
       leaving two Vimeo players decoding at once. There is now one iframe,
       created once, never recreated.

  For a genuinely instant hero, see the note at the bottom of this file
  about self-hosting the loop.
*/

(function () {
    'use strict';

    // Never initialise twice — protects against double includes and against
    // a prerendered page being activated.
    if (window.__synkynHeroVideo) return;
    window.__synkynHeroVideo = true;

    var wrap = document.querySelector('.hero-video-bg');
    if (!wrap) return;

    var frame = wrap.querySelector('.hero-bg-iframe');
    if (!frame) return;

    var WARM_KEY = 'synkyn_vimeo_warm';
    var warm = false;
    try {
        warm = sessionStorage.getItem(WARM_KEY) === 'true';
    } catch (e) { }

    // A warm session means Vimeo's assets are in the HTTP cache, so the
    // player paints almost immediately and we can reveal without the
    // settle delay a cold first load needs.
    var SETTLE_MS = warm ? 60 : 320;

    var revealed = false;

    function reveal() {
        if (revealed) return;
        revealed = true;
        wrap.classList.add('is-playing');
        try {
            sessionStorage.setItem(WARM_KEY, 'true');
        } catch (e) { }
        try {
            document.dispatchEvent(new CustomEvent('synkyn:vimeoready'));
        } catch (e) { }
    }

    function boot() {
        var onLoaded = function () {
            setTimeout(reveal, SETTLE_MS);
        };

        frame.addEventListener('load', onLoaded, { once: true });

        // Listen for Vimeo player postMessage events (ready, play, playing)
        function onMessage(e) {
            if (!e || !e.data) return;
            try {
                var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                if (data && (data.event === 'play' || data.event === 'ready' || data.event === 'playing')) {
                    reveal();
                    window.removeEventListener('message', onMessage);
                }
            } catch (err) { }
        }
        window.addEventListener('message', onMessage);

        var src = frame.getAttribute('src') || frame.getAttribute('data-src');
        if (!frame.src && src) {
            frame.src = src;
        }

        // Guaranteed reveal before the 4-second loading curtain opens
        setTimeout(reveal, 2200);
    }

    /* ------------------------------------------------------------------
       Prerender awareness
       Speculation Rules may build this page before the click. Chrome
       defers media autoplay in a prerendered document until activation, so
       we hold the reveal until the page is actually shown. The network
       work still happens early, which is the point.
       ------------------------------------------------------------------ */
    if (document.prerendering) {
        document.addEventListener('prerenderingchange', boot, { once: true });
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }

    /* ------------------------------------------------------------------
       Back / forward cache
       On a bfcache restore the iframe is still alive and the video is
       still decoded. Do nothing except make sure it is visible.
       ------------------------------------------------------------------ */
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            revealed = false;
            reveal();
        }
    });

    /* ------------------------------------------------------------------
       Tab visibility
       Pause the background loop while the tab is hidden so it stops
       burning decode and battery, then resume. Uses the Vimeo Player API
       when available and degrades silently when it is not.
       ------------------------------------------------------------------ */
    var player = null;

    function getPlayer() {
        if (player) return player;
        if (!(window.Vimeo && window.Vimeo.Player) || !frame.src) return null;
        try {
            player = new Vimeo.Player(frame);
        } catch (e) {
            return null;
        }
        return player;
    }

    document.addEventListener('visibilitychange', function () {
        var p = getPlayer();
        if (!p) return;
        if (document.hidden) {
            p.pause().catch(function () { });
        } else {
            p.play().catch(function () { });
        }
    });

    /* ------------------------------------------------------------------
       Poster fallback
       If the poster image is missing the CSS gradient underneath carries
       the hero, so there is still no black flash.
       ------------------------------------------------------------------ */
    var poster = wrap.querySelector('.hero-video-poster');
    if (poster && poster.tagName === 'IMG') {
        poster.addEventListener('error', function () {
            poster.style.display = 'none';
        }, { once: true });
    }
})();

/*
  ─────────────────────────────────────────────────────────────────────────
  THE PROPER FIX, IF YOU WANT ONE
  ─────────────────────────────────────────────────────────────────────────
  This hero background is muted, looping, has no controls and no sound. It
  does not need a video player at all — but a Vimeo iframe loads an entire
  player application before a single frame decodes: player.js, its CSS, a
  config JSON round trip, then analytics, then the media segments. That
  startup cost is paid on every single page load and no amount of client
  code removes it.

  Export the loop as a short self-hosted file and the iframe disappears:

      <video class="hero-bg-video" autoplay loop muted playsinline
             preload="auto" poster="./images/hero-poster.webp">
        <source src="./videos/hero-loop.webm" type="video/webm" />
        <source src="./videos/hero-loop.mp4"  type="video/mp4" />
      </video>

  Encode a 6-10 second seamless loop, 1920x1080, no audio track:

      ffmpeg -i source.mp4 -t 8 -an -c:v libvpx-vp9 -crf 34 -b:v 0 \
             -vf scale=1920:-2 hero-loop.webm
      ffmpeg -i source.mp4 -t 8 -an -c:v libx264 -crf 26 -preset slow \
             -movflags +faststart -vf scale=1920:-2 hero-loop.mp4

  That lands around 1-2 MB, caches under your own immutable headers, and
  starts in roughly 100ms on a repeat visit because it is a plain file
  fetch with no player bootstrap. It also removes a third-party dependency
  from your critical render path entirely.

  Keep Vimeo for the Showreel modal, where the player UI is actually used.
*/
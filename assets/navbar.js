/*
  Synkyn Studios
  Copyright (c) 2026 Synkyn Studios. All rights reserved.
*/

/**
 * Synkyn Studios — Premium Mobile Navigation Controller
 * --------------------------------------------------------------------------
 * - Injects an app-style slide-down menu panel into the existing .sidebar
 * - Fully owns open / close / toggle (capture-phase interception so it can't
 *   conflict with the bundled main.js open handler)
 * - Dim/blur backdrop, body + Lenis scroll lock, outside-click + ESC to close
 * - Auto-closes after navigation, highlights the active page
 * - Scroll-aware: hides on scroll-down, reveals on scroll-up, always shown at top
 * --------------------------------------------------------------------------
 */
(function () {
    'use strict';

    const navbar = document.querySelector('.header-two');
    const sidebar = document.querySelector('.sidebar');
    if (!navbar) return;

    /* ----------------------------------------------------------------------
       1. Dim / blur backdrop
       ---------------------------------------------------------------------- */
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    /* ----------------------------------------------------------------------
       2. Inject the redesigned menu content
       ---------------------------------------------------------------------- */
    if (sidebar) {
        sidebar.innerHTML = `
        <div class="mobile-menu-inner">
            <div class="mobile-menu-top">
                <img src="https://www.synkynstudios.com/images/logo.png" alt="Synkyn Studios" class="mobile-menu-logo">
                <button class="mobile-menu-close" aria-label="Close menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <nav class="mobile-menu-links">
                <a href="./" class="mobile-menu-link" data-path="index.html">Home</a>
                <a href="./about-us.html" class="mobile-menu-link" data-path="about-us.html">About Us</a>
                <a href="./library.html" class="mobile-menu-link" data-path="library.html">Library</a>
                <a href="./printalbum.html" class="mobile-menu-link" data-path="printalbum.html">Print Album</a>
                <a href="./about-us.html#team" class="mobile-menu-link" data-path="about-us.html#team">Our Team</a>
                <a href="./contact.html" class="mobile-menu-link" data-path="contact.html">Contact</a>
            </nav>

            <div class="mobile-menu-divider"></div>

            <div class="mobile-menu-footer-block">
                <div class="mobile-menu-label">Let's Talk</div>
                <a href="mailto:contact@synkynstudios.com" class="mobile-menu-email">contact@synkynstudios.com <span class="plus-icon">+</span></a>
                <div class="mobile-menu-location">Bengaluru (IN) <span class="time-placeholder"></span></div>
            </div>

            <div class="mobile-menu-footer-block">
                <div class="mobile-menu-label">Socials</div>
                <div class="mobile-menu-socials">
                    <a href="https://www.instagram.com/synkyn_studios/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/synkynstudios/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                </div>
            </div>

            <div class="mobile-menu-bottom-bar">
                <div class="bottom-links">
                    <a href="./terms.html" data-path="terms.html">Terms & Conditions ↗</a>
                </div>
                <div class="bottom-copyright">© 2026 Synkyn® All rights reserved.</div>
            </div>
        </div>`;

        /* --- Active page detection --- */
        const path = window.location.pathname;
        const hash = window.location.hash;
        const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        const full = file + hash;
        let matched = false;

        // Prefer an exact file + hash match (e.g. about-us.html#team)
        if (hash) {
            sidebar.querySelectorAll('[data-path]').forEach(link => {
                if (link.getAttribute('data-path') === full) {
                    link.classList.add('active');
                    matched = true;
                }
            });
        }
        // Fallback: match the page file, ignoring hash-only links
        if (!matched) {
            sidebar.querySelectorAll('[data-path]').forEach(link => {
                const dp = link.getAttribute('data-path') || '';
                if (!dp.includes('#') && (dp === file || (file === 'index.html' && dp === 'index.html'))) {
                    link.classList.add('active');
                    matched = true;
                }
            });
        }
    }

    /* ----------------------------------------------------------------------
       3. Open / close machinery (with Lenis-aware scroll lock)
       ---------------------------------------------------------------------- */
    const lenis = () => (typeof window !== 'undefined' && window.lenis) ? window.lenis : null;

    function lockScroll() {
        document.body.classList.add('overflow-hidden', 'mobile-menu-active');
        const l = lenis();
        if (l && typeof l.stop === 'function') l.stop();
    }

    function unlockScroll() {
        document.body.classList.remove('overflow-hidden', 'mobile-menu-active');
        const l = lenis();
        if (l && typeof l.start === 'function') l.start();
    }

    function isOpen() {
        return !!sidebar && sidebar.classList.contains('show-sidebar');
    }

    function openMenu() {
        if (!sidebar) return;
        navbar.classList.remove('nav-hidden');   // keep header visible while open
        sidebar.classList.add('show-sidebar');
        overlay.classList.add('show-overlay');
        lockScroll();
    }

    function closeMenu() {
        if (!sidebar) return;
        sidebar.classList.remove('show-sidebar');
        overlay.classList.remove('show-overlay');
        unlockScroll();
    }

    function toggleMenu() {
        isOpen() ? closeMenu() : openMenu();
    }

    /* ----------------------------------------------------------------------
       4. Wire up interactions
       ---------------------------------------------------------------------- */
    // Own the hamburger in the CAPTURE phase so the bundled open-only handler
    // (main.js) never fires — works regardless of script execution order.
    const hamburger = navbar.querySelector('.nav-hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleMenu();
        }, { capture: true });
    }

    // Click the dim backdrop -> close
    overlay.addEventListener('click', closeMenu);

    // Click the X in the full screen menu
    const mobileCloseBtn = sidebar ? sidebar.querySelector('.mobile-menu-close') : null;
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMenu);
    }

    // Close after tapping any link in the panel (navigation / same-page hash)
    if (sidebar) {
        sidebar.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });
    }

    // ESC closes
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // Safety: close if we cross into the desktop breakpoint
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1280 && isOpen()) closeMenu();
        navbar.classList.remove('nav-hidden');
    }, { passive: true });

    /* ----------------------------------------------------------------------
       5. Scroll-aware hide / reveal
       ---------------------------------------------------------------------- */
    let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
    let ticking = false;
    const DELTA = 8;        // ignore tiny jitters
    const TOP_BAND = 80;    // always visible within this band from the top

    function readScroll() {
        const l = lenis();
        if (l && typeof l.scroll === 'number') return l.scroll;
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    // Always ensure navbar is visible upon page load / refresh anywhere in the document
    navbar.classList.remove('nav-hidden');
    lastY = readScroll();

    // Lock navbar visible during page load / refresh so scroll restoration never hides it
    let readyForHide = false;
    setTimeout(() => {
        readyForHide = true;
        lastY = readScroll();
        navbar.classList.remove('nav-hidden');
    }, 2200);

    function update() {
        ticking = false;
        let y = readScroll();
        if (y < 0) y = 0;

        // Never hide while the menu is open or during initial load/refresh grace period
        if (isOpen()) { lastY = y; return; }
        if (!readyForHide) {
            navbar.classList.remove('nav-hidden');
            lastY = y;
            return;
        }

        // Always show near the top
        if (y <= TOP_BAND) {
            navbar.classList.remove('nav-hidden');
            lastY = y;
            return;
        }

        // Avoid toggling on iOS rubber-band at the very bottom
        const docH = document.documentElement.scrollHeight;
        const winH = window.innerHeight;
        if (y + winH >= docH - 8) { lastY = y; return; }

        const delta = y - lastY;
        if (Math.abs(delta) < DELTA) return;

        if (delta > 0) navbar.classList.add('nav-hidden');   // down -> hide
        else navbar.classList.remove('nav-hidden');          // up   -> reveal

        lastY = y;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }

    // Native scroll (rAF-throttled; safe even when Lenis is active)
    window.addEventListener('scroll', onScroll, { passive: true });

    // Attach to Lenis as soon as it exists (it may init after this script)
    (function attachLenis(tries) {
        const l = lenis();
        if (l && typeof l.on === 'function') {
            l.on('scroll', onScroll);
            return;
        }
        if (tries > 0) requestAnimationFrame(() => attachLenis(tries - 1));
    })(60);

    window.addEventListener('pageshow', () => {
        navbar.classList.remove('nav-hidden');
        lastY = readScroll();
    });
    document.addEventListener('DOMContentLoaded', () => {
        navbar.classList.remove('nav-hidden');
        lastY = readScroll();
    });

    update();
})();
/* ----------------------------------------------------------------------
   Hash Scrolling Handler for Lenis / Native
   ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    function scrollToHash(hash) {
        if (!hash) return;
        try {
            const target = document.querySelector(hash);
            if (target) {
                // Account for fixed header height
                const headerOffset = 100;
                if (window.lenis) {
                    window.lenis.scrollTo(target, { offset: -headerOffset });
                } else {
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        } catch (e) { }
    }

    // Scroll on page load
    if (window.location.hash) {
        setTimeout(() => scrollToHash(window.location.hash), 500);
    }

    // Intercept hash changes
    window.addEventListener('hashchange', () => {
        scrollToHash(window.location.hash);
    });

    // Intercept clicks on anchor tags pointing to the same page
    document.querySelectorAll('a[href^="about-us.html#"], a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            let targetHash = '';

            if (href.startsWith('#')) {
                targetHash = href;
            } else if (href.startsWith('about-us.html#') && window.location.pathname.includes('about-us.html')) {
                targetHash = href.replace('about-us.html', '');
            }

            if (targetHash) {
                e.preventDefault();
                history.pushState(null, null, targetHash);
                scrollToHash(targetHash);
            }
        });
    });
});

/* ----------------------------------------------------------------------
   What's New Dynamic Configuration
   ---------------------------------------------------------------------- */
window.SynkynWhatsNew = {
    // Set to 'video' for auto-playing background, or 'image' for static thumbnail
    type: 'image',
    src: './images/ns-img-485.png', // using the default image
    title: 'NBK111 Glimpse',
    description: '#NBK111 Glimpse - Entry of an Era',
    link: './library.html#work-nbk111'
};

document.addEventListener('DOMContentLoaded', () => {
    // Find the "What's new" section by looking for its title text
    const pElements = document.querySelectorAll('p');
    let whatsNewTitle = null;
    for (const p of pElements) {
        if (p.textContent.trim() === 'What’s new') {
            whatsNewTitle = p;
            break;
        }
    }

    if (whatsNewTitle && window.SynkynWhatsNew) {
        const container = whatsNewTitle.nextElementSibling; // the <div> wrapping the <figure>
        if (!container) return;

        const figure = container.querySelector('figure');
        if (!figure) return;

        // Update Title & Description
        const titleEl = figure.querySelector('.text-tagline-1');
        const descEl = figure.querySelector('.text-tagline-2');
        if (titleEl) titleEl.textContent = window.SynkynWhatsNew.title;
        if (descEl) descEl.textContent = window.SynkynWhatsNew.description;

        // Update Link
        const linkEl = figure.querySelector('a');
        if (linkEl) linkEl.href = window.SynkynWhatsNew.link;

        // Update Background Media
        const mediaContainer = figure.querySelector('.relative.max-w-\\[596px\\]');
        if (mediaContainer) {
            if (window.SynkynWhatsNew.type === 'video') {
                mediaContainer.innerHTML = `
                    <video src="${window.SynkynWhatsNew.src}" autoplay loop muted playsinline 
                           class="h-full w-full object-cover blur-sm opacity-80" 
                           style="position:absolute; inset:0;"></video>
                `;
            } else if (window.SynkynWhatsNew.type === 'image') {
                mediaContainer.innerHTML = `
                    <img src="${window.SynkynWhatsNew.src}" alt="What's new" 
                         class="h-full w-full object-cover blur-sm opacity-80" 
                         style="position:absolute; inset:0;" />
                `;
            }
        }
    }
});


/* ==========================================================================
   BACK-TO-TOP — NATIVE FALLBACK
   The primary toggle lives inside a lenis.on('scroll') handler in
   index.html. If Lenis fails to initialise, that handler never runs and the
   button can never appear. This listens to native scroll as well; both
   paths set the same class, so they cannot disagree.
   ========================================================================== */
(function () {
    'use strict';
    var btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    var ticking = false;
    function read() {
        return (window.lenis && typeof window.lenis.scroll === 'number')
            ? window.lenis.scroll
            : (window.pageYOffset || document.documentElement.scrollTop || 0);
    }
    function update() {
        ticking = false;
        btn.classList.toggle('is-visible', read() > 450);
    }
    function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pageshow', update);
    update();

    // Click works with or without Lenis.
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(0, { duration: 1.2 });
            return;
        }
        var reduce = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
})();

/* ==========================================================================
   SAME-PAGE LINK GUARD — every page, every nav link
   --------------------------------------------------------------------------
   Clicking a link for the page you are already on used to do a full
   document navigation: tear down and rebuild everything, replay the hero
   reveal, re-boot the Vimeo player, all to land exactly where you already
   were.

   This lives in navbar.js rather than desktop-navbar.js so it covers the
   desktop menu, the mobile panel and the footer on every page from one
   place. The listener is delegated on document, so it works no matter when
   the menu markup is injected.

   Paths are normalised because "/", "/index.html" and "./" all address the
   same document and a plain string compare would miss it.
   ========================================================================== */
(function () {
    'use strict';

    var suppressUntil = 0;

    function normalise(href) {
        try {
            var u = new URL(href, window.location.href);
            var p = u.pathname.replace(/\/index\.html?$/i, '/').replace(/\/{2,}/g, '/');
            if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
            return u.origin + (p || '/');
        } catch (e) {
            return null;
        }
    }

    function closeDesktopMenus() {
        document.querySelectorAll('.mega-menu.active, .dropdown-menu.active')
            .forEach(function (m) { m.classList.remove('active'); });
        document.querySelectorAll('.nav-item.active, .nav-item.menu-active')
            .forEach(function (n) { n.classList.remove('active', 'menu-active'); });
        document.querySelectorAll('.mega-menu-bridge, .dropdown-menu-bridge')
            .forEach(function (b) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; });
        // The pointer is still inside the panel, so main.js would happily
        // re-open it. Hold it shut briefly.
        suppressUntil = Date.now() + 700;
    }

    // main.js dispatches menu:show; veto it while suppressed.
    document.addEventListener('menu:show', function (e) {
        if (Date.now() > suppressUntil) return;
        var d = e.detail || {};
        if (d.menu) d.menu.classList.remove('active');
        if (d.navItem) d.navItem.classList.remove('active', 'menu-active');
    });

    function closeMobilePanel() {
        var sidebar = document.querySelector('.sidebar.show-sidebar');
        if (!sidebar) return;
        sidebar.classList.remove('show-sidebar');
        var ov = document.querySelector('.nav-overlay.show-overlay');
        if (ov) ov.classList.remove('show-overlay');
        document.body.classList.remove('overflow-hidden', 'mobile-menu-active');
        if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
    }

    document.addEventListener('click', function (e) {
        // Leave modified clicks alone — Ctrl/Cmd/middle open a new tab.
        if (e.defaultPrevented || e.button !== 0 ||
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        var link = e.target.closest ? e.target.closest('a[href]') : null;
        if (!link) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;

        var href = link.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

        var hash = '';
        try { hash = new URL(href, window.location.href).hash; } catch (err) { return; }
        // A hash for this page means "scroll to that section" — let it through.
        if (hash && hash !== window.location.hash) return;

        var target = normalise(href);
        if (target === null || target !== normalise(window.location.href)) return;

        e.preventDefault();
        closeDesktopMenus();
        closeMobilePanel();

        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(0, { duration: 1.1 });
        } else {
            var reduce = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        }
    }, false);

    /* Mark the current page's link for styling and for screen readers. */
    function markCurrent() {
        var here = normalise(window.location.href);
        document.querySelectorAll('a[href]').forEach(function (a) {
            if (!a.closest('.header-two, #desktop-navbar, .sidebar, footer')) return;
            var h = a.getAttribute('href') || '';
            if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return;
            try { if (new URL(h, location.href).hash) return; } catch (err) { return; }
            if (normalise(h) === here) {
                a.classList.add('is-current');
                a.setAttribute('aria-current', 'page');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markCurrent, { once: true });
    } else {
        markCurrent();
    }
})();
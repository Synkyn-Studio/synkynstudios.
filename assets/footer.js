(function () {
    var t = document.getElementById('disp-time');
    var ap = document.getElementById('disp-ampm');
    function tick() {
        try {
            var parts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }).formatToParts(new Date());
            var map = {};
            parts.forEach(function (p) {
                map[p.type] = p.value;
            });
            if (t) t.textContent = (map.hour || '--') + ':' + (map.minute || '--') + ':' + (map.second || '--');
            if (ap) ap.textContent = (map.dayPeriod || '').toUpperCase();
        } catch (e) {
            if (t) t.textContent = '\u2014';
        }
    }
    tick();
    setInterval(tick, 1000);
})();

/* ── Hide bottom blur overlay when footer is in view ── */
(function () {
    function initFooterBlurObserver() {
        var footer = document.querySelector('footer.site-footer, footer');
        if (!footer || !('IntersectionObserver' in window)) return;

        function getBlurWrapper() {
            return document.querySelector('.gradual-blur-wrapper, #sticky-bar');
        }

        var observer = new IntersectionObserver(function (entries) {
            var wrapper = getBlurWrapper();
            if (!wrapper) return;

            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Footer is visible → hide the bottom blur
                    wrapper.style.setProperty('opacity', '0', 'important');
                    wrapper.style.setProperty('pointer-events', 'none', 'important');
                } else {
                    // Footer is out of view → restore the bottom blur
                    wrapper.style.removeProperty('opacity');
                    wrapper.style.removeProperty('pointer-events');
                }
            });
        }, {
            root: null,
            threshold: 0.05  // trigger as soon as 5% of the footer is visible
        });

        observer.observe(footer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooterBlurObserver);
    } else {
        initFooterBlurObserver();
    }
})();

/* ── Disable footer links pointing to the current page ── */
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var currentUrl = window.location.href.split('#')[0];
        var currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        var links = document.querySelectorAll('.footer-link');
        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            // Match absolute URL or exact relative filename (ignoring hash)
            if (link.href.split('#')[0] === currentUrl || href.replace('./', '').split('#')[0] === currentPath) {
                link.removeAttribute('href');
                link.style.cursor = 'default';
                link.style.opacity = '0.5';
            }
        });
    });
})();

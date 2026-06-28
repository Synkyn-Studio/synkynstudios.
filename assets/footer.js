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
    var footer = document.querySelector('footer.disp');
    if (!footer || !('IntersectionObserver' in window)) return;

    function getBlurWrapper() {
        // The gradual-blur wrapper is generated dynamically by main.js,
        // so we look it up each time in case it hasn't been created yet.
        return document.querySelector('.gradual-blur-wrapper');
    }

    var observer = new IntersectionObserver(function (entries) {
        var wrapper = getBlurWrapper();
        if (!wrapper) return;

        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Footer is visible → hide the bottom blur
                wrapper.classList.remove('is-visible');
                wrapper.classList.add('is-hidden');
                wrapper.style.opacity = '0';
                wrapper.style.pointerEvents = 'none';
            } else {
                // Footer is out of view → show the bottom blur
                wrapper.classList.remove('is-hidden');
                wrapper.classList.add('is-visible');
                wrapper.style.opacity = '';
                wrapper.style.pointerEvents = '';
            }
        });
    }, {
        root: null,
        threshold: 0.05  // trigger as soon as 5% of the footer is visible
    });

    observer.observe(footer);
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

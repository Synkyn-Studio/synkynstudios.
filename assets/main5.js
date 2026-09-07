/*
  Synkyn Studios
  Copyright (c) 2026 Synkyn Studios. All rights reserved.
*/

import "./main.js";
import "./particle-effect-init-Cl6WPB64.js";

function t() {
    return "undefined" != typeof window && window.lenis ? window.lenis : null
}

function n() {
    const t = document.querySelector("body > header");
    if (!t) return 104;
    const n = (t.querySelector(".header-two") || t.firstElementChild || t).getBoundingClientRect();
    return Math.min(Math.ceil(n.bottom + 12), 200)
}

function e() {
    const e = document.querySelector("[data-about-origin-snap]"),
        o = null == e ? void 0 : e.querySelector(".origin-story-section");
    if (!e || !o) return;
    let i = !1,
        r = !1;
    const c = () => {
        if (r = !1, i) return;
        const e = o.getBoundingClientRect().top,
            c = window.innerHeight || 1,
            l = n();
        e < .68 * c && e > .14 * c && e > l + 24 && (i = !0, requestAnimationFrame(() => function (e) {
            const o = n(),
                i = Math.max(0, e.getBoundingClientRect().top + function () {
                    const n = t();
                    return n && "number" == typeof n.scroll ? n.scroll : window.scrollY || document
                        .documentElement.scrollTop || 0
                }() - o),
                r = t();
            r && "function" == typeof r.scrollTo ? r.scrollTo(i, {
                duration: 1.05,
                easing: t => 1 - (1 - t) ** 3
            }) : window.scrollTo({
                top: i,
                behavior: "smooth"
            })
        }(o)))
    },
        l = () => {
            i ? o.getBoundingClientRect().bottom < 0 && (i = !1) : r || (r = !0, requestAnimationFrame(c))
        };
    window.addEventListener("scroll", l, {
        passive: !0
    });
    const u = () => {
        const n = t();
        return !(!n || "function" != typeof n.on || (n.on("scroll", l), 0))
    };
    if (!u()) {
        let t = 48;
        const n = () => {
            u() || --t <= 0 || requestAnimationFrame(n)
        };
        requestAnimationFrame(n)
    }
    l()
}
"loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : e();
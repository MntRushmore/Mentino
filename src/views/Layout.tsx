import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CompassIcon } from "./components/Icons";
import { config } from "../config";

interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  user?: { first_name: string; role: string } | null;
  flash?: string | null;
  navBadges?: { unreadMessages?: number; pendingRequests?: number };
  currentPath?: string;
  /** Render children edge-to-edge (the page manages its own containers). */
  bleed?: boolean;
}

const DEFAULT_DESCRIPTION =
  "Mentino matches students with verified working professionals for free career mentorship. Browse mentors across 40+ fields, message them, and schedule sessions.";

/*
 * Design system
 * ─────────────
 * Spacing   4pt scale only (Tailwind whole-number units: 1 = 4px). No half steps.
 * Type      Inter for everything: semibold, slightly tight headings; regular body; small caps labels.
 * Color     White canvas, near-black ink #111111, warm off-white panels #f7f6f4.
 *           Legacy note: canvas was #fbf8f2 · panel #f4f1ea · sand · sage · clay · butter.
 *           Pumpkin #b84d0c is the action color (class name `forest`/`pumpkin`), on pale cream.
 *           The logo is a white bulb on a pumpkin orange tile.
 * Radius    4px controls (buttons, inputs, tags) · 12px containers (cards, panels, modals)
 * Elevation hairline borders; one overlay shadow for floating layers only
 * Motion    150ms for hover/state, 240ms for enter; one easing curve; honours reduced motion
 */
const TAILWIND_CONFIG = `
(function(){
  var forest = { 50:"#fdf3ea",100:"#fbe6d3",200:"#f6cba5",300:"#f0a96f",400:"#e8742a",500:"#d9661c",600:"#b84d0c",700:"#9a400a",800:"#7c340a",900:"#5f280a",950:"#3f1a06" };
  var warm   = { 50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#6b6762",500:"#57534e",600:"#44403c",700:"#2f2c29",800:"#1f1d1b",900:"#111111",950:"#0a0a0a" };
  var none = "none";
  var hairline = "0 1px 0 rgba(31,36,32,0.04)";
  tailwind.config = {
    theme: { extend: {
      colors: {
        indigo: forest, blue: forest, primary: forest, violet: forest, purple: forest,
        emerald: forest, green: forest, teal: forest, lime: forest, pink: forest, fuchsia: forest,
        cyan: warm, sky: warm,
        gray: warm, slate: warm, neutral: warm, zinc: warm, stone: warm,
        canvas: "#ffffff", panel: "#f7f6f4", ink: "#111111", accent: "#b4532a",
        forest: "#b84d0c", pumpkin: "#b84d0c", sand: "#f7f6f4", sage: "#f7f6f4", clay: "#fdf1e6", butter: "#fff6ea", terracotta: "#b4532a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        xs:   ["12px", { lineHeight: "16px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg:   ["18px", { lineHeight: "28px" }],
        xl:   ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
        "3xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "4xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
        "5xl": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em" }],
        "6xl": ["56px", { lineHeight: "60px", letterSpacing: "-0.03em" }],
        "7xl": ["72px", { lineHeight: "76px", letterSpacing: "-0.035em" }],
      },
      borderRadius: { sm: "4px", DEFAULT: "4px", md: "4px", lg: "4px", xl: "12px", "2xl": "12px", "3xl": "12px" },
      boxShadow: { sm: hairline, DEFAULT: hairline, md: hairline, lg: hairline, xl: hairline, "2xl": hairline, inner: none },
    } },
  };
})();
`;

const BASE_CSS = `
:root {
  --canvas: #ffffff;
  --surface: #ffffff;
  --panel: #f7f6f4;
  --sunken: #f5f5f4;
  --ink: #111111;
  --ink-strong: #000000;
  --muted: #57534e;
  --subtle: #6b6762;
  --line: rgba(17,17,17,0.10);
  --line-strong: rgba(17,17,17,0.22);
  --forest: #b84d0c;
  --forest-strong: #9a400a;
  --accent: #b4532a;
  --sand: #f7f6f4;
  --sage: #f7f6f4;
  --clay: #fdf1e6;
  --butter: #fff6ea;
  --radius-control: 4px;
  --radius-container: 12px;
  --shadow-overlay: 0 16px 40px -16px rgba(31,36,32,0.28);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dur-fast: 150ms;
  --dur-enter: 240ms;
  --noise: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
html { background: var(--canvas); scroll-behavior: smooth; }
body {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: var(--ink);
  background: var(--canvas);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
::selection { background: var(--forest); color: #fff; }
h1, h2, h3, h4 { font-weight: 600 !important; letter-spacing: -0.02em; }
.font-serif { font-weight: 600 !important; letter-spacing: -0.035em; }
.serif-bold { font-weight: 700 !important; letter-spacing: -0.025em; }
.font-extrabold, .font-bold { font-weight: 600 !important; }
.bg-white { background-color: var(--surface) !important; }
.border-gray-100, .border-gray-200, .border-slate-100, .border-slate-200 { border-color: var(--line) !important; }
.border-gray-300 { border-color: var(--line-strong) !important; }

/* Focus: one visible ring for every interactive element */
:focus { outline: none; }
:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
input:not([type=checkbox]):not([type=radio]), select, textarea {
  background-color: #fff;
  border-color: var(--line-strong);
  border-radius: var(--radius-control);
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
input:focus, select:focus, textarea:focus {
  border-color: var(--ink) !important;
  box-shadow: 0 0 0 3px rgba(184,77,12,0.18) !important;
  --tw-ring-shadow: 0 0 #0000 !important;
}
input[type=checkbox], input[type=radio] { accent-color: var(--ink); }

/* Type helpers */
.t-eyebrow { font-size: 12px; line-height: 16px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.t-meta { font-size: 13px; line-height: 16px; color: var(--subtle); }

/* Surfaces and textures */
.texture { position: relative; isolation: isolate; }
.texture::before { content: ""; position: absolute; inset: 0; z-index: -1; background-image: var(--noise); opacity: 0.12; mix-blend-mode: multiply; pointer-events: none; }

/* Buttons */
.btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; padding: 0 16px; border: 1px solid transparent; border-radius: var(--radius-control);
  font-size: 14px; line-height: 20px; font-weight: 600; letter-spacing: -0.005em;
  white-space: nowrap; text-decoration: none; cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.btn-sm { height: 32px; padding: 0 12px; }
.btn-lg { height: 48px; padding: 0 24px; font-size: 14px; line-height: 20px; }
.btn-dot::before { content: ""; width: 4px; height: 4px; border-radius: 9999px; background: currentColor; flex-shrink: 0; }
.btn-block { display: flex; width: 100%; }
.btn-primary { background: var(--forest); color: #fff; }
.btn-primary:hover { background: var(--forest-strong); }
.btn-secondary { background: #fff; border-color: var(--ink); color: var(--ink); }
.btn-secondary:hover { background: var(--ink); color: #fff; }
.btn-dark { background: var(--ink); color: #fff; }
.btn-dark:hover { background: #000; }
.btn-ghost { background: transparent; color: var(--muted); }
.btn-ghost:hover { background: var(--sunken); color: var(--ink); }
.btn-inverse { background: var(--canvas); color: var(--ink-strong); }
.btn-inverse:hover { background: #e4e6ea; }
.btn-inverse-outline { background: transparent; border-color: rgba(255,255,255,0.28); color: #fff; }
.btn-inverse-outline:hover { background: rgba(255,255,255,0.08); }
.btn:disabled, .btn[aria-disabled=true] { opacity: 0.5; cursor: not-allowed; }

/* Loading state for any button (added by the submit handler below) */
.is-loading { position: relative; color: transparent !important; pointer-events: none; }
.is-loading::after {
  content: ""; position: absolute; inset: 0; margin: auto; width: 16px; height: 16px;
  border: 2px solid var(--spin, currentColor); border-right-color: transparent; border-radius: 9999px;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Containers */
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-container); }
.card-interactive { transition: border-color var(--dur-fast) var(--ease), transform 220ms var(--ease), box-shadow 220ms var(--ease); }
.card-interactive:hover { border-color: var(--line-strong); transform: translateY(-4px); box-shadow: 0 16px 32px -20px rgba(31,36,32,0.35); }
.zoom-on-hover { transition: transform 600ms var(--ease); }
a:hover .zoom-on-hover, .group:hover .zoom-on-hover, .card-interactive:hover .zoom-on-hover { transform: scale(1.04); }

/* Glass buttons: reserved for the main calls to action */
.btn-glass, .btn-glass-light { position: relative; overflow: hidden; backdrop-filter: blur(12px) saturate(160%); -webkit-backdrop-filter: blur(12px) saturate(160%);
  transition: transform 180ms var(--ease), box-shadow 180ms var(--ease), background-color var(--dur-fast) var(--ease); }
.btn-glass { color: #fff; background: linear-gradient(135deg, rgba(194,84,15,0.94), rgba(154,64,10,0.94)); border-color: rgba(255,255,255,0.35);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 24px -12px rgba(154,64,10,0.7); }
.btn-glass-light { color: #fff; background: rgba(17,17,17,0.82); border-color: rgba(255,255,255,0.18);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 20px -12px rgba(0,0,0,0.5); }
.btn-glass:hover, .btn-glass-light:hover { transform: translateY(-2px); }
.btn-glass:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 14px 28px -12px rgba(154,64,10,0.75); }
.btn-glass-light:hover { background: rgba(0,0,0,0.9); }
.btn-glass::after, .btn-glass-light::after { content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent); transform: skewX(-20deg); transition: left 600ms var(--ease); }
.btn-glass:hover::after, .btn-glass-light:hover::after { left: 120%; }
.btn-glass:active, .btn-glass-light:active { transform: translateY(0); }

/* Scroll reveal (set up by the script at the end of <body>) */
.js [data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity 600ms var(--ease), transform 600ms var(--ease); }
.js [data-reveal].is-visible { opacity: 1; transform: none; }
.progress-fill { transition: width 900ms var(--ease); }
.overlay { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-container); box-shadow: var(--shadow-overlay); }

/* Site navigation: transparent over the home hero, solid once scrolled */
.site-nav { background: rgba(255,255,255,0.88); border-bottom: 1px solid var(--line); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px);
  transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease); }
.site-nav.nav-overlay:not(.is-scrolled):not(.is-open) { background: transparent; border-color: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }

/* Navigation items */
.nav-link {
  position: relative; display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 12px;
  border-radius: var(--radius-control); font-size: 14px; line-height: 20px; color: var(--muted);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.nav-link:hover { color: var(--ink); }
.nav-link[aria-current=page] { color: var(--ink); font-weight: 600; box-shadow: inset 0 -2px 0 var(--forest); border-radius: 0; }
.beta-badge { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 9999px; background: #fbe6d3; color: var(--forest);
  font-size: 11px; line-height: 16px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.count-badge {
  display: inline-flex; align-items: center; justify-content: center; min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 9999px; background: var(--accent); color: #fff; font-size: 11px; line-height: 16px; font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* Async feedback: route progress bar + image skeletons */
#route-progress {
  position: fixed; top: 0; left: 0; z-index: 10000; height: 2px; width: 0; background: var(--forest); opacity: 0;
  transition: width 200ms var(--ease), opacity 200ms var(--ease);
}
#route-progress.is-active { opacity: 1; width: 90%; transition: width 8s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 150ms var(--ease); }
.skeleton { background: var(--sunken); animation: pulse 1.6s ease-in-out infinite; }
.skeleton.is-loaded { animation: none; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
img[data-fade] { opacity: 0; transition: opacity var(--dur-enter) var(--ease); }
img[data-fade].is-loaded { opacity: 1; }

/* Skip link */
.skip-link { position: absolute; left: 16px; top: -48px; z-index: 10001; }
.skip-link:focus { top: 8px; }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Entrance motion: short, one direction, one curve */
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideRight { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
.anim-fade-up { animation: fadeUp 480ms var(--ease) both; }
.anim-fade-in { animation: fadeIn 480ms var(--ease) both; }
.anim-slide-r { animation: slideRight 480ms var(--ease) both; }
.anim-d1 { animation-delay: 80ms; }
.anim-d2 { animation-delay: 160ms; }
.anim-d3 { animation-delay: 240ms; }
.anim-d4 { animation-delay: 320ms; }
.anim-d5 { animation-delay: 400ms; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
}
`;

// Loading feedback for navigation, form submits and images. Runs without hydration.
const ASYNC_FEEDBACK_JS = `
(function() {
  var bar = document.getElementById('route-progress');
  function startProgress() { if (bar) { bar.classList.remove('is-active'); void bar.offsetWidth; bar.classList.add('is-active'); } }
  function resetAll() {
    if (bar) bar.classList.remove('is-active');
    document.querySelectorAll('.is-loading').forEach(function(b) { b.classList.remove('is-loading'); b.removeAttribute('aria-busy'); });
  }

  document.addEventListener('click', function(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    startProgress();
  });

  document.addEventListener('submit', function(e) {
    if (e.defaultPrevented) return;
    var form = e.target;
    if (form.target === '_blank' || form.method === 'dialog') return;
    var btn = e.submitter || form.querySelector('button[type=submit], button:not([type])');
    if (btn && btn.tagName === 'BUTTON') {
      btn.style.setProperty('--spin', getComputedStyle(btn).color);
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
    }
    startProgress();
  });

  window.addEventListener('pageshow', resetAll);

  function markLoaded(img) {
    img.classList.add('is-loaded');
    var holder = img.closest('.skeleton');
    if (holder) holder.classList.add('is-loaded');
  }
  // ── Motion: scroll reveal, count-up numbers, filling bars ──
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var main = document.getElementById('main');
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')); if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (main && !reduce && 'IntersectionObserver' in window) {
    var targets = [];
    main.querySelectorAll('section, article.card, .grid > *, ol > li.card').forEach(function(el) {
      if (el.closest('.anim-fade-up') || el.querySelector('.anim-fade-up') || el.closest('[data-no-reveal]')) return;
      if (el.parentElement && el.parentElement.closest('[data-reveal]')) return;
      el.setAttribute('data-reveal', '');
      if (el.parentElement && el.parentElement.classList.contains('grid')) {
        var i = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
      }
      targets.push(el);
    });
    var bars = main.querySelectorAll('.progress-fill');
    bars.forEach(function(b) { b.setAttribute('data-width', b.style.width); b.style.width = '0%'; targets.push(b); });
    var nums = main.querySelectorAll('[data-count]');
    nums.forEach(function(n) { targets.push(n); });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.hasAttribute('data-reveal')) el.classList.add('is-visible');
        if (el.classList.contains('progress-fill')) el.style.width = el.getAttribute('data-width');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(function(t) { io.observe(t); });
  }

  document.querySelectorAll('img[data-fade]').forEach(function(img) {
    if (img.complete && img.naturalWidth) return markLoaded(img);
    img.addEventListener('load', function() { markLoaded(img); });
    img.addEventListener('error', function() { markLoaded(img); });
  });
})();
`;

export function Layout({ title = "Mentino", description = DEFAULT_DESCRIPTION, children, user, flash, navBadges, currentPath, bleed = false }: LayoutProps) {
  const fullTitle = title === "Mentino" ? "Mentino | Free mentorship from working professionals" : `${title} | Mentino`;
  const origin = config.siteUrl;
  const ogImage = `${origin}/images/hero-bg.jpg`;
  const pageUrl = origin && currentPath ? `${origin}${currentPath}` : undefined;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#ffffff" />
        {pageUrl && <link rel="canonical" href={pageUrl} />}
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="apple-touch-icon" href="/images/logo-icon.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/images/logo-icon.png" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mentino" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content="A student being mentored by a working professional" />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: TAILWIND_CONFIG }} />
        <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "img[data-fade]{opacity:1}.skeleton{animation:none}" }} />
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link btn btn-primary btn-sm">Skip to content</a>
        <div id="route-progress" aria-hidden="true" />
        <Navbar user={user} badges={navBadges} currentPath={currentPath} overlay={bleed} />
        {user && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              // Request notification permission once
              if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
              }

              var lastUnread = ${(navBadges?.unreadMessages || 0)};

              function checkNotifications() {
                fetch('/api/notifications')
                  .then(function(r) { return r.json(); })
                  .then(function(data) {
                    // New message notification
                    if (data.unreadMessages > lastUnread && Notification.permission === 'granted') {
                      var diff = data.unreadMessages - lastUnread;
                      new Notification('Mentino: New message', {
                        body: diff + ' new message' + (diff > 1 ? 's' : '') + ' waiting for you.',
                        icon: '/images/logo-icon.png',
                        tag: 'mentino-msg',
                      });
                    }
                    lastUnread = data.unreadMessages;

                    // Session reminder (15-min warning)
                    if (data.upcomingSessions) {
                      data.upcomingSessions.forEach(function(s) {
                        var msUntil = new Date(s.scheduled_at) - Date.now();
                        if (msUntil > 0 && msUntil < 16 * 60 * 1000 && !sessionStorage.getItem('notified-' + s.id)) {
                          sessionStorage.setItem('notified-' + s.id, '1');
                          if (Notification.permission === 'granted') {
                            new Notification('Mentino: Session in 15 min', {
                              body: 'Your session with ' + s.other_name + ' starts soon.',
                              icon: '/images/logo-icon.png',
                              tag: 'mentino-session-' + s.id,
                            });
                          }
                        }
                      });
                    }
                  })
                  .catch(function() {});
              }

              // Poll every 30 seconds
              setInterval(checkNotifications, 30000);
            })();
          `}} />
        )}
        {flash && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full">
            <div role="status" className="card px-4 py-3 text-sm text-gray-900 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" aria-hidden="true" />
              {flash}
            </div>
          </div>
        )}
        <main id="main" className={bleed ? "flex-1 w-full" : "flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full"}>{children}</main>
        <Footer />
        {/* Persistent quiz button: bottom-left, hidden on the quiz page itself */}
        {currentPath !== "/quiz" && currentPath !== "/messages" && (
          <a href="/quiz" id="quiz-fab" className="btn btn-dark fixed bottom-6 left-6 z-40" style={{ boxShadow: "var(--shadow-overlay)" }}>
            <CompassIcon />
            Career Quiz
          </a>
        )}
        <script dangerouslySetInnerHTML={{ __html: ASYNC_FEEDBACK_JS }} />
      </body>
    </html>
  );
}

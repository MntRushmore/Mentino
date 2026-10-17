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
 * Type      Newsreader (serif) for display headings · Inter for body and UI ·
 *           IBM Plex Mono for button labels and small metadata only.
 * Color     Warm neutrals: canvas #fbfaf7 · panel #f4f1ea · sand · sage · clay · butter.
 *           Forest #2c4a3e is the action color; terracotta #b4532a is the small accent.
 *           The purple/blue gradient belongs to the logo only.
 * Radius    4px controls (buttons, inputs, tags) · 12px containers (cards, panels, modals)
 * Elevation hairline borders; one overlay shadow for floating layers only
 * Motion    150ms for hover/state, 240ms for enter; one easing curve; honours reduced motion
 */
const TAILWIND_CONFIG = `
(function(){
  var forest = { 50:"#eef3ef",100:"#dce7df",200:"#bcd0c2",300:"#93b29d",400:"#5f8a6e",500:"#3f6b55",600:"#2c4a3e",700:"#223b31",800:"#1a2e26",900:"#13221c",950:"#0c1612" };
  var warm   = { 50:"#faf8f4",100:"#f4f1ea",200:"#e7e2d8",300:"#d5cfc2",400:"#6e6a62",500:"#5a5650",600:"#46433e",700:"#35332f",800:"#262522",900:"#1f2420",950:"#151714" };
  var none = "none";
  var hairline = "0 1px 0 rgba(31,36,32,0.04)";
  tailwind.config = {
    theme: { extend: {
      colors: {
        indigo: forest, blue: forest, primary: forest, violet: forest, purple: forest,
        gray: warm, slate: warm, neutral: warm, zinc: warm, stone: warm,
        canvas: "#fbfaf7", panel: "#f4f1ea", ink: "#1f2420", accent: "#b4532a",
        forest: "#2c4a3e", sand: "#ece4d4", sage: "#e3eadf", clay: "#f3e4d7", butter: "#f6edcf", terracotta: "#b4532a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
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
  --canvas: #fbfaf7;
  --surface: #ffffff;
  --panel: #f4f1ea;
  --sunken: #f4f1ea;
  --ink: #1f2420;
  --ink-strong: #151714;
  --muted: #5a5650;
  --subtle: #6e6a62;
  --line: rgba(31,36,32,0.10);
  --line-strong: rgba(31,36,32,0.22);
  --forest: #2c4a3e;
  --forest-strong: #223b31;
  --accent: #b4532a;
  --sand: #ece4d4;
  --sage: #e3eadf;
  --clay: #f3e4d7;
  --butter: #f6edcf;
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
h1, h2, h3, h4 { font-weight: 500 !important; }
.font-serif { font-weight: 400 !important; letter-spacing: -0.02em; }
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
  box-shadow: 0 0 0 3px rgba(44,74,62,0.14) !important;
  --tw-ring-shadow: 0 0 #0000 !important;
}
input[type=checkbox], input[type=radio] { accent-color: var(--ink); }

/* Type helpers */
.t-eyebrow { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
.t-meta { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 12px; line-height: 16px; color: var(--subtle); }

/* Surfaces and textures */
.texture { position: relative; isolation: isolate; }
.texture::before { content: ""; position: absolute; inset: 0; z-index: -1; background-image: var(--noise); opacity: 0.12; mix-blend-mode: multiply; pointer-events: none; }

/* Buttons */
.btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; padding: 0 16px; border: 1px solid transparent; border-radius: var(--radius-control);
  font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 13px; line-height: 16px; font-weight: 500;
  white-space: nowrap; text-decoration: none; cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.btn-sm { height: 32px; padding: 0 12px; }
.btn-lg { height: 48px; padding: 0 24px; font-size: 14px; line-height: 20px; }
.btn-dot::before { content: ""; width: 4px; height: 4px; border-radius: 9999px; background: currentColor; flex-shrink: 0; }
.btn-block { display: flex; width: 100%; }
.btn-primary { background: var(--forest); color: #fff; }
.btn-primary:hover { background: var(--forest-strong); }
.btn-secondary { background: var(--surface); border-color: var(--line-strong); color: var(--ink); }
.btn-secondary:hover { background: var(--sunken); }
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
.card-interactive { transition: border-color var(--dur-fast) var(--ease); }
.card-interactive:hover { border-color: var(--line-strong); }
.overlay { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-container); box-shadow: var(--shadow-overlay); }

/* Site navigation: transparent over the home hero, solid once scrolled */
.site-nav { background: rgba(251,250,247,0.9); border-bottom: 1px solid var(--line); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px);
  transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease); }
.site-nav.nav-overlay:not(.is-scrolled):not(.is-open) { background: transparent; border-color: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }

/* Navigation items */
.nav-link {
  position: relative; display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 12px;
  border-radius: var(--radius-control); font-size: 14px; line-height: 20px; color: var(--muted);
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.nav-link:hover { color: var(--ink); }
.nav-link[aria-current=page] { color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px; }
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
        <meta name="theme-color" content="#fbfaf7" />
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
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
        {currentPath !== "/quiz" && (
          <a href="/quiz" id="quiz-fab" className="btn btn-primary fixed bottom-6 left-6 z-40" style={{ boxShadow: "var(--shadow-overlay)" }}>
            <CompassIcon />
            Career Quiz
          </a>
        )}
        <script dangerouslySetInnerHTML={{ __html: ASYNC_FEEDBACK_JS }} />
      </body>
    </html>
  );
}

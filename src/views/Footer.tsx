import React from "react";

const linkClass = "text-gray-900 hover:underline underline-offset-4 decoration-1";

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200 overflow-hidden" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 tracking-tight">
              <img src="/images/logo.svg" alt="" width={28} height={28} className="w-7 h-7" />
              Mentino
            </p>
            <p className="text-gray-900 text-sm max-w-xs">
              Free mentorship for students. Real professionals who want to give back. No network required.
            </p>
          </div>
          <div>
            <h4 className="t-eyebrow text-gray-900 mb-4" style={{ color: "var(--ink)" }}>Platform</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="/how-it-works" className={linkClass}>How It Works</a></li>
              <li><a href="/tracks" className={linkClass}>Career Tracks</a></li>
              <li><a href="/resources" className={linkClass}>Resources</a></li>
              <li><a href="/signup" className={linkClass}>Sign Up</a></li>
              <li><a href="/code-of-conduct" className={linkClass}>Code of Conduct</a></li>
            </ul>
          </div>
          <div>
            <h4 className="t-eyebrow mb-4" style={{ color: "var(--ink)" }}>Learn More</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="/about" className={linkClass}>About Mentino</a></li>
              <li><a href="/founder" className={linkClass}>About the Founder</a></li>
              <li><a href="/blog" className={linkClass}>Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="t-eyebrow mb-4" style={{ color: "var(--ink)" }}>Contact</h4>
            <p className="text-gray-900 text-sm mb-2">Questions or feedback?</p>
            <a href="mailto:hello@mentino.org" className="text-gray-900 text-sm underline underline-offset-4 decoration-1">
              hello@mentino.org
            </a>
          </div>
        </div>

        <div className="border-t border-gray-900/20 mt-12 pt-6 flex flex-col md:flex-row justify-between md:items-center gap-4 text-gray-900 t-meta" style={{ color: "var(--ink)" }}>
          <span>&copy; {new Date().getFullYear()} Mentino · Built for students, by students.</span>
          <div className="flex gap-6">
            <a href="/terms" className={linkClass}>Terms of Service</a>
            <a href="/privacy" className={linkClass}>Privacy Policy</a>
          </div>
        </div>

        {/* Oversized wordmark, cropped by the bottom edge */}
        <p aria-hidden="true" className="font-semibold select-none leading-none mt-8 -mb-[0.18em]"
          style={{ fontSize: "clamp(96px, 21vw, 320px)", letterSpacing: "-0.05em", color: "var(--ink)" }}>
          Mentino
        </p>
      </div>
    </footer>
  );
}

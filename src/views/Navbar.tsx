import React from "react";
import { ChevronDownIcon } from "./components/Icons";

interface NavbarProps {
  user?: { first_name: string; role: string } | null;
  badges?: { unreadMessages?: number; pendingRequests?: number };
  currentPath?: string;
  /** Start transparent over a full-bleed hero; turns solid on scroll. */
  overlay?: boolean;
}

interface NavLink {
  href: string;
  label: string;
  badge?: number;
}

function formatCount(n: number) {
  return n > 9 ? "9+" : String(n);
}

export function Navbar({ user, badges, currentPath = "/", overlay = false }: NavbarProps) {
  const unread = badges?.unreadMessages || 0;
  const pending = badges?.pendingRequests || 0;

  const publicLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/mentors", label: "Mentors" },
    { href: "/matching", label: "Matching" },
    { href: "/founder", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/tracks", label: "Tracks" },
    { href: "/resources", label: "Resources" },
    { href: "/blog", label: "Blog" },
  ];

  const authLinks: NavLink[] = user
    ? [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        ...(user.role === "student" ? [{ href: "/matching", label: "Matching" }] : []),
        { href: "/messages", label: "Messages", badge: unread },
        { href: "/sessions", label: "Sessions" },
        { href: "/mentors", label: "Mentors" },
        { href: "/tracks", label: "Tracks" },
        { href: "/resources", label: "Resources" },
        { href: "/blog", label: "Blog" },
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];

  const links = user ? authLinks : publicLinks;
  const isActive = (href: string) => (href === "/" ? currentPath === "/" : currentPath.startsWith(href));
  const menuItem = "flex items-center gap-2 w-full h-10 px-3 rounded-lg text-sm transition-colors";

  return (
    <>
      <nav id="site-nav" className={`site-nav sticky top-0 z-50${overlay ? " nav-overlay" : ""}`} aria-label="Primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/" className="flex-shrink-0" aria-label="Mentino home">
                <img src="/images/logo.svg" alt="" width={32} height={32} className="w-8 h-8" />
              </a>
              <a href="/" className="text-lg font-semibold tracking-tight text-gray-900">Mentino</a>
            </div>

            {/* Desktop nav links + actions, grouped to the right */}
            <div className={`hidden ${user ? "xl" : "lg"}:flex items-center gap-1 ml-auto`}>
              {links.map((link) => (
                <a key={link.href} href={link.href} className="nav-link" aria-current={isActive(link.href) ? "page" : undefined}>
                  {link.label}
                  {(link.badge ?? 0) > 0 && (
                    <span className="count-badge" aria-label={`${link.badge} unread`}>{formatCount(link.badge ?? 0)}</span>
                  )}
                </a>
              ))}
            </div>

            <div className={`hidden ${user ? "xl" : "lg"}:flex items-center gap-2 pl-4 border-l border-gray-200`}>
              {user ? (
                <div className="relative" id="profile-menu-wrap">
                  <button id="profile-menu-btn" type="button" className="btn btn-secondary btn-sm"
                    aria-haspopup="menu" aria-expanded="false" aria-controls="profile-menu-dropdown">
                    {user.first_name}
                    {pending > 0 && user.role === "mentor" && (
                      <span className="count-badge" aria-label={`${pending} pending requests`}>{formatCount(pending)}</span>
                    )}
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <div id="profile-menu-dropdown" role="menu"
                    className="hidden overlay absolute right-0 top-full mt-2 w-48 p-1 z-50">
                    <a href="/profile" role="menuitem" className={`${menuItem} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </a>
                    <a href="/profile/edit" role="menuitem" className={`${menuItem} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </a>
                    <div className="border-t border-gray-200 my-1" />
                    <form method="POST" action="/logout">
                      <button type="submit" role="menuitem" className={`${menuItem} text-red-700 hover:bg-red-50`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <a href="/login" className="btn btn-ghost btn-sm">Log in</a>
                  <a href="/signup" className="btn btn-primary btn-sm btn-dot">Sign Up Free</a>
                </>
              )}
            </div>

            {/* Mobile: right side (name if logged in) + hamburger */}
            <div className={`flex items-center gap-2 ${user ? "xl" : "lg"}:hidden`}>
              {user ? (
                <a href="/profile" className="text-gray-900 text-sm truncate max-w-[96px]">{user.first_name}</a>
              ) : (
                <a href="/signup" className="btn btn-primary btn-sm">Sign Up Free</a>
              )}
              <button
                id="hamburger-btn"
                type="button"
                className="btn btn-ghost btn-sm w-8 px-0"
                aria-label="Toggle menu"
                aria-expanded="false"
                aria-controls="mobile-nav"
              >
                <svg id="ham-icon-open" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <svg id="ham-icon-close" className="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div id="mobile-nav" className={`hidden ${user ? "xl" : "lg"}:hidden border-t border-gray-200`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`${menuItem} justify-between ${isActive(link.href) ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                {link.label}
                {(link.badge ?? 0) > 0 && (
                  <span className="count-badge">{formatCount(link.badge ?? 0)}</span>
                )}
              </a>
            ))}
            {user ? (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <form method="POST" action="/logout">
                  <button type="submit" className={`${menuItem} text-red-700 hover:bg-red-50`}>
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="pt-4 mt-2 border-t border-gray-200 grid grid-cols-2 gap-2">
                <a href="/login" className="btn btn-secondary">Log in</a>
                <a href="/signup" className="btn btn-primary">Sign Up Free</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Menu toggles: works without React hydration */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var nav = document.getElementById('site-nav');
          if (nav && nav.classList.contains('nav-overlay')) {
            var onScroll = function() { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
          }
          var btn = document.getElementById('hamburger-btn');
          var menu = document.getElementById('mobile-nav');
          var iconOpen = document.getElementById('ham-icon-open');
          var iconClose = document.getElementById('ham-icon-close');
          function setMobile(open) {
            if (!btn || !menu) return;
            menu.classList.toggle('hidden', !open);
            iconOpen.classList.toggle('hidden', open);
            iconClose.classList.toggle('hidden', !open);
            btn.setAttribute('aria-expanded', String(open));
            if (nav) nav.classList.toggle('is-open', open);
          }
          if (btn) {
            btn.addEventListener('click', function() { setMobile(menu.classList.contains('hidden')); });
          }

          var profileBtn = document.getElementById('profile-menu-btn');
          var profileDropdown = document.getElementById('profile-menu-dropdown');
          function setProfile(open) {
            if (!profileBtn || !profileDropdown) return;
            profileDropdown.classList.toggle('hidden', !open);
            profileBtn.setAttribute('aria-expanded', String(open));
          }
          if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              setProfile(profileDropdown.classList.contains('hidden'));
            });
            profileDropdown.addEventListener('click', function(e) { e.stopPropagation(); });
            document.addEventListener('click', function() { setProfile(false); });
          }

          document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape') return;
            if (profileDropdown && !profileDropdown.classList.contains('hidden')) { setProfile(false); profileBtn.focus(); }
            if (menu && !menu.classList.contains('hidden')) { setMobile(false); btn.focus(); }
          });
        })();
      `}} />
    </>
  );
}

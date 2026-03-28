import React from "react";

interface NavbarProps {
  user?: { first_name: string; role: string } | null;
  badges?: { unreadMessages?: number; pendingRequests?: number };
  currentPath?: string;
}

export function Navbar({ user, badges, currentPath = "/" }: NavbarProps) {
  const unread = badges?.unreadMessages || 0;
  const pending = badges?.pendingRequests || 0;

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/founder", label: "About the Founder" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/blog", label: "Blog" },
  ];

  const authLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        ...(user.role === "student" ? [{ href: "/matching", label: "Find Mentors" }] : []),
        { href: "/messages", label: "Messages", badge: unread },
        { href: "/sessions", label: "Sessions" },
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)" }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 00-4 12.75V17a1 1 0 001 1h6a1 1 0 001-1v-2.25A7 7 0 0012 2z" opacity="0.85" />
                  <rect x="9" y="19" width="6" height="1.5" rx="0.75" opacity="0.9" />
                  <rect x="9.5" y="21.5" width="5" height="1" rx="0.5" opacity="0.7" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight" style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mentino</span>
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-6">
              {user
                ? authLinks.map((link) => (
                    <a key={link.href} href={link.href} className="text-gray-600 hover:text-indigo-600 font-medium relative text-sm">
                      {link.label}
                      {link.badge > 0 && (
                        <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {link.badge > 9 ? "9+" : link.badge}
                        </span>
                      )}
                    </a>
                  ))
                : publicLinks.map((link) => {
                    const isActive = currentPath === link.href;
                    return (
                      <a key={link.href} href={link.href}
                        className={isActive
                          ? "text-indigo-600 font-semibold bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-sm"
                          : "text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors"
                        }
                      >
                        {link.label}
                      </a>
                    );
                  })}
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  {/* Profile dropdown */}
                  <div className="relative" id="profile-menu-wrap">
                    <button id="profile-menu-btn" type="button"
                      className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors">
                      {user.first_name}
                      {pending > 0 && user.role === "mentor" && (
                        <span className="bg-yellow-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {pending > 9 ? "9+" : pending}
                        </span>
                      )}
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div id="profile-menu-dropdown"
                      className="hidden absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                      <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </a>
                      <a href="/profile/edit" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </a>
                      <div className="border-t border-gray-100 my-1" />
                      <form method="POST" action="/logout">
                        <button type="submit" className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a href="/login" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">Log in</a>
                  <a href="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 font-semibold transition-colors text-sm">
                    Sign Up Free
                  </a>
                </div>
              )}
            </div>

            {/* Mobile: right side (name if logged in) + hamburger */}
            <div className="flex items-center gap-1.5 md:hidden">
              {user && (
                <a href="/profile" className="text-gray-700 font-medium text-sm truncate max-w-[80px]">{user.first_name}</a>
              )}
              <button
                id="hamburger-btn"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg id="ham-icon-open" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg id="ham-icon-close" className="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div id="mobile-nav" className="hidden md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {user
              ? authLinks.map((link) => (
                  <a key={link.href} href={link.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium text-sm"
                  >
                    {link.label}
                    {link.badge > 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>
                    )}
                  </a>
                ))
              : publicLinks.map((link) => {
                  const isActive = currentPath === link.href;
                  return (
                    <a key={link.href} href={link.href}
                      className={`block px-3 py-2.5 rounded-lg font-medium text-sm ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"}`}
                    >
                      {link.label}
                    </a>
                  );
                })}
            {user ? (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <form method="POST" action="/logout">
                  <button type="submit" className="w-full text-left px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 mt-2 flex gap-2">
                <a href="/login" className="flex-1 text-center px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50">
                  Log in
                </a>
                <a href="/signup" className="flex-1 text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700">
                  Sign Up Free
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger toggle script — works without React hydration */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var btn = document.getElementById('hamburger-btn');
          var menu = document.getElementById('mobile-nav');
          var iconOpen = document.getElementById('ham-icon-open');
          var iconClose = document.getElementById('ham-icon-close');
          if (btn) {
            btn.addEventListener('click', function() {
              var hidden = menu.classList.toggle('hidden');
              iconOpen.classList.toggle('hidden', !hidden);
              iconClose.classList.toggle('hidden', hidden);
            });
          }
          var profileBtn = document.getElementById('profile-menu-btn');
          var profileDropdown = document.getElementById('profile-menu-dropdown');
          if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              profileDropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', function() {
              profileDropdown.classList.add('hidden');
            });
          }
        })();
      `}} />
    </>
  );
}

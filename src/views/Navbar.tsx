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

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-10">
            {user ? (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Dashboard
                </a>

                {user.role === "student" && (
                  <a href="/matching" className="text-gray-600 hover:text-indigo-600 font-medium">
                    Find Mentors
                  </a>
                )}

                <a href="/messages" className="text-gray-600 hover:text-indigo-600 font-medium relative">
                  Messages
                  {unread > 0 && (
                    <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </a>

                <a href="/sessions" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Sessions
                </a>

                {user.role === "admin" && (
                  <a href="/admin" className="text-gray-600 hover:text-indigo-600 font-medium">
                    Admin
                  </a>
                )}
              </>
            ) : (
              publicLinks.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={
                      isActive
                        ? "text-indigo-600 font-semibold bg-indigo-50 border border-indigo-200 px-5 py-2 rounded-full transition-colors"
                        : "text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                    }
                  >
                    {link.label}
                  </a>
                );
              })
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <a href="/profile" className="text-gray-600 hover:text-indigo-600 font-medium relative">
                  {user.first_name}
                  {pending > 0 && user.role === "mentor" && (
                    <span className="absolute -top-2 -right-4 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {pending > 9 ? "9+" : pending}
                    </span>
                  )}
                </a>
                <form method="POST" action="/logout" className="inline">
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-red-500 text-sm font-medium"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <a
                href="/signup"
                className="bg-indigo-600 text-white px-7 py-2.5 rounded-full hover:bg-indigo-700 font-semibold transition-colors text-sm"
              >
                Start Connecting
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

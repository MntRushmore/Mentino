import React from "react";

interface NavbarProps {
  user?: { first_name: string; role: string } | null;
  badges?: { unreadMessages?: number; pendingRequests?: number };
}

export function Navbar({ user, badges }: NavbarProps) {
  const unread = badges?.unreadMessages || 0;
  const pending = badges?.pendingRequests || 0;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">Mentino</span>
          </a>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                  Dashboard
                </a>

                {user.role === "student" && (
                  <a href="/matching" className="text-gray-600 hover:text-blue-600 font-medium">
                    Find Mentors
                  </a>
                )}

                <a href="/messages" className="text-gray-600 hover:text-blue-600 font-medium relative">
                  Messages
                  {unread > 0 && (
                    <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </a>

                <a href="/sessions" className="text-gray-600 hover:text-blue-600 font-medium">
                  Sessions
                </a>

                {user.role === "admin" && (
                  <a href="/admin" className="text-gray-600 hover:text-blue-600 font-medium">
                    Admin
                  </a>
                )}

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <a href="/profile" className="text-gray-600 hover:text-blue-600 font-medium relative">
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
              </>
            ) : (
              <>
                <a href="/about" className="text-gray-600 hover:text-blue-600 font-medium">
                  About
                </a>
                <a
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

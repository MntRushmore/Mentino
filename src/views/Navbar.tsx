import React from "react";

interface NavbarProps {
  user?: { first_name: string; role: string } | null;
}

export function Navbar({ user }: NavbarProps) {
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
                <a href="/matching" className="text-gray-600 hover:text-blue-600 font-medium">
                  Find Matches
                </a>
                <a href="/messages" className="text-gray-600 hover:text-blue-600 font-medium">
                  Messages
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
                  <a href="/profile" className="text-gray-600 hover:text-blue-600 font-medium">
                    {user.first_name}
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
                <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">
                  How It Works
                </a>
                <a href="/blog" className="text-gray-600 hover:text-blue-600 font-medium">
                  Blog
                </a>
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

import React from "react";

interface LoginProps {
  error?: string;
}

export function Login({ error }: LoginProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)" }}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a7 7 0 00-4 12.75V17a1 1 0 001 1h6a1 1 0 001-1v-2.25A7 7 0 0012 2z" opacity="0.85" />
              <rect x="9" y="19" width="6" height="1.5" rx="0.75" opacity="0.9" />
              <rect x="9.5" y="21.5" width="5" height="1" rx="0.5" opacity="0.7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome back</h1>
          <p className="text-gray-500 text-sm sm:text-base">Log in to your Mentino account</p>
        </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form method="POST" action="/login" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
      </div>
    </div>
  );
}

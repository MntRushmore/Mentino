import React from "react";

interface SignupProps {
  error?: string;
}

export function Signup({ error }: SignupProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Join Mentino</h1>
          <p className="text-gray-500 text-sm sm:text-base">Free for students. Verified professionals. Real guidance.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form method="POST" action="/signup" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="First"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Last"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="At least 8 characters"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 transition-colors">
                  <input type="radio" name="role" value="student" required className="sr-only" />
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎓</div>
                    <div className="font-semibold text-gray-800 text-sm">Student</div>
                    <div className="text-xs text-gray-400 mt-0.5">Find a mentor</div>
                  </div>
                </label>
                <label className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 transition-colors">
                  <input type="radio" name="role" value="mentor" className="sr-only" />
                  <div className="text-center">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="font-semibold text-gray-800 text-sm">Mentor</div>
                    <div className="text-xs text-gray-400 mt-0.5">Share expertise</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                About Me <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                placeholder="A quick intro — who you are, what you're interested in, what you're hoping to get from Mentino..."
              />
              <p className="text-xs text-gray-400 mt-1">You can always add more later in your profile.</p>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" name="tos_agreed" value="1" required className="mt-0.5 rounded text-indigo-600 flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I've read and agree to the{" "}
                <a href="/terms" target="_blank" className="text-indigo-600 hover:underline font-medium">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" target="_blank" className="text-indigo-600 hover:underline font-medium">Privacy Policy</a>.
                {" "}I understand that use of Mentino is at my own risk.
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors text-base shadow-sm hover:shadow-md"
            >
              Create My Free Account →
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline font-semibold">Log in</a>
          </p>
        </div>

        {/* Bottom trust row */}
        <div className="flex justify-center flex-wrap gap-4 mt-6 text-gray-400 text-xs">
          {["Free forever for students", "No spam", "Cancel anytime"].map((t) => (
            <div key={t} className="flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

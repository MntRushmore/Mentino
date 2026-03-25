import React from "react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Mentino</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting students with verified professionals for personalized career guidance. Free for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/signup" className="text-slate-400 hover:text-white transition-colors">
                  Sign Up
                </a>
              </li>
              <li>
                <a href="/code-of-conduct" className="text-slate-400 hover:text-white transition-colors">
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Learn More</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Mentino
                </a>
              </li>
              <li>
                <a href="/founder" className="text-slate-400 hover:text-white transition-colors">
                  About the Founder
                </a>
              </li>
              <li>
                <a href="/blog" className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <p className="text-slate-400 text-sm">
              Questions or feedback?
            </p>
            <a href="mailto:hello@mentino.org" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              hello@mentino.org
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500 text-sm">
          <span>&copy; {new Date().getFullYear()} Mentino. Built for students, by students.</span>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

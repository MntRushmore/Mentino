import React from "react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Mentino. Built for students, by students.
        </div>
      </div>
    </footer>
  );
}

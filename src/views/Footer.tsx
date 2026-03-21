import React from "react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-3">Mentino</h3>
            <p className="text-gray-500 text-sm">
              Connecting students with mentors for real-world career guidance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-gray-500 hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="/code-of-conduct" className="text-gray-500 hover:text-blue-600">
                  Code of Conduct
                </a>
              </li>
              <li>
                <a href="/signup" className="text-gray-500 hover:text-blue-600">
                  Become a Mentor
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Contact</h4>
            <p className="text-gray-500 text-sm">
              Questions? Reach out at{" "}
              <a href="mailto:hello@mentino.org" className="text-blue-600 hover:underline">
                hello@mentino.org
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Mentino. Built for students, by the community.
        </div>
      </div>
    </footer>
  );
}

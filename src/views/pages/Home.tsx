import React from "react";

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Find Your <span className="text-blue-600">Mentor</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Mentino connects students with verified working professionals for personalized career
          guidance. Get real-world advice from people who've been where you want to go.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Profile</h3>
            <p className="text-gray-500">
              Sign up as a student or mentor. Tell us about your goals, interests, and availability.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Matched</h3>
            <p className="text-gray-500">
              Our algorithm finds mentors that align with your career interests, schedule, and
              learning style.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Learning</h3>
            <p className="text-gray-500">
              Connect through messaging and video sessions. Get guidance on careers, interviews,
              college, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Career Fields */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explore Career Fields
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Technology", icon: "💻" },
            { name: "Medicine", icon: "🏥" },
            { name: "Law", icon: "⚖️" },
            { name: "Business", icon: "📊" },
            { name: "Sports", icon: "🏅" },
            { name: "Arts", icon: "🎨" },
          ].map((field) => (
            <div
              key={field.name}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="text-3xl mb-2">{field.icon}</div>
              <div className="font-medium text-gray-700">{field.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 rounded-2xl text-white text-center mb-8">
        <h2 className="text-3xl font-bold mb-8">Making an Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-blue-200 mt-1">Students Matched</div>
          </div>
          <div>
            <div className="text-4xl font-bold">200+</div>
            <div className="text-blue-200 mt-1">Verified Mentors</div>
          </div>
          <div>
            <div className="text-4xl font-bold">15+</div>
            <div className="text-blue-200 mt-1">Career Fields</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Whether you're a student looking for guidance or a professional wanting to give back,
          Mentino is for you.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up as a Student
          </a>
          <a
            href="/signup"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Become a Mentor
          </a>
        </div>
      </section>
    </div>
  );
}

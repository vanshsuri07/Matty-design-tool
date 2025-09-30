import React from "react";

// You can replace these with actual icons from a library like Heroicons or Lucide React
const Icon = ({ children }) => (
  <div className="bg-coral/10 text-coral p-3 rounded-full mb-4">{children}</div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <Icon>{icon}</Icon>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const WhyChooseCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="text-coral mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 max-w-xs">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title, avatar }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
    <p className="text-gray-600 italic mb-6">"{quote}"</p>
    <div className="flex items-center">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-pastel-blue via-white to-pastel-purple font-sans antialiased text-gray-700">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter text-gray-800">
            Matty
          </h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-coral transition-colors">
              Features
            </a>
            <a href="#why" className="hover:text-coral transition-colors">
              Why Matty
            </a>
            <a
              href="#testimonials"
              className="hover:text-coral transition-colors"
            >
              Testimonials
            </a>
          </nav>
          <a
            href="/register"
            className="bg-gray-800 text-white px-5 py-2 rounded-full hover:bg-coral transition-colors duration-300"
          >
            Get Started
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-24 pb-12">
          <div className="container mx-auto text-center px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
              Design Smarter with <span className="text-coral">Matty</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your all-in-one design tool for faster, more beautiful creations.
            </p>
            <a
              href="#start"
              className="bg-coral text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 inline-block"
            >
              Start Designing Free
            </a>
            <div className="mt-16 w-full max-w-5xl mx-auto p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/70 overflow-hidden">
              <div className="h-96 rounded-lg flex items-center justify-center">
                <img
                  src="/mock-up.png" // <--- IMPORTANT: Update this path if your image is elsewhere
                  alt="Matty Design Tool Interface Mockup"
                  className="w-full h-full object-cover rounded-lg" // <--- Tailwind classes for fitting
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Everything You Need, All in One Place
              </h2>
              <p className="text-gray-600 mt-2">
                Powerful features that make design a breeze.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4l-3-3m-4 11-4 4-4-4m8 0v-7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7" />
                  </svg>
                }
                title="Drag-and-Drop Editor"
                description="Effortlessly build beautiful interfaces with our intuitive editor."
              />
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                }
                title="Templates & Assets"
                description="Jumpstart your projects with a vast library of ready-to-use resources."
              />
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
                title="Real-time Collaboration"
                description="Work with your team on the same canvas, at the same time."
              />
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                }
                title="Multiple Export Formats"
                description="Export your designs in PNG, SVG, PDF, and more with a single click."
              />
            </div>
          </div>
        </section>

        {/* Why Choose Matty Section */}
        <section id="why" className="py-20 bg-white/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Why Designers Love Matty
              </h2>
              <p className="text-gray-600 mt-2">
                We focus on what matters most.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <WhyChooseCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                }
                title="Unmatched Speed"
                description="Our tool is optimized for performance, ensuring a smooth and lag-free workflow."
              />
              <WhyChooseCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                  </svg>
                }
                title="Pure Simplicity"
                description="No steep learning curve. Get started in minutes and focus on your creativity."
              />
              <WhyChooseCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                title="Seamless Collaboration"
                description="Share, comment, and design together in real-time, no matter where your team is."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">
                Loved by Creatives Worldwide
              </h2>
              <p className="text-gray-600 mt-2">
                Don't just take our word for it.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="Matty has completely transformed our design process. The speed and real-time collaboration features are game-changers for our remote team."
                name="Sarah Johnson"
                title="Lead UI/UX Designer, Innovate Co."
                avatar="https://randomuser.me/api/portraits/women/44.jpg"
              />
              <TestimonialCard
                quote="I've tried many design tools, but Matty's simplicity and powerful features make it my go-to choice. The template library is a lifesaver!"
                name="David Chen"
                title="Freelance Product Designer"
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
              />
            </div>
          </div>
        </section>

        {/* Call to Action (Bottom Section) */}
        <section id="start" className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gray-800 text-white text-center p-12 md:p-20 rounded-3xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Unleash Your Creativity Today
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Join thousands of designers building the future. No credit card
                required.
              </p>
              <a
                href="/register"
                className="bg-coral text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 inline-block"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Matty Design Tool. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

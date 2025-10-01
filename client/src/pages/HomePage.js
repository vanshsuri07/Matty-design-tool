import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: "🎨",
      title: "Intuitive Design Canvas",
      description:
        "Drag-and-drop interface with professional-grade tools for creating stunning graphics.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Built with modern web technologies for smooth, responsive design experience.",
    },
    {
      icon: "☁️",
      title: "Cloud Storage",
      description:
        "Your designs are automatically saved and accessible from anywhere.",
    },
    {
      icon: "📱",
      title: "Mobile Responsive",
      description:
        "Design on desktop, tablet, or mobile - your workspace adapts to any screen.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your designs are protected with enterprise-grade security.",
    },
    {
      icon: "📤",
      title: "Easy Export",
      description:
        "Download your creations in high-quality PNG format instantly.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      image: "👩‍💼",
      quote:
        "Matty has revolutionized how I create marketing materials. Simple, fast, and professional.",
    },
    {
      name: "Alex Chen",
      role: "Freelance Designer",
      image: "👨‍🎨",
      quote:
        "The perfect tool for quick prototypes and client presentations. Highly recommend!",
    },
    {
      name: "Maria Rodriguez",
      role: "Social Media Manager",
      image: "👩‍💻",
      quote:
        "Creating social media graphics has never been easier. Matty is a game-changer!",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">Matty</div>
              <div className="ml-2 text-sm text-gray-600">AI Design Tool</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-indigo-600"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-indigo-600"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Design Made
              <span className="text-indigo-600"> Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional graphics, social media posts, and marketing
              materials with our intuitive AI-powered design tool. No design
              experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                Start Creating - It's Free
              </button>
              <button className="border border-gray-300 hover:border-indigo-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <div className="text-2xl font-semibold text-gray-800">
                    Your Canvas Awaits
                  </div>
                  <div className="text-gray-600 mt-2">
                    Professional design tools at your fingertips
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make graphic design accessible to
              everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-indigo-200">Designs Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-indigo-200">Design Templates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-indigo-200">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about Matty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-4">{testimonial.image}</div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">$0</div>
                <p className="text-gray-600 mb-6">
                  Perfect for getting started
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>5 designs per
                  month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Basic templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  PNG export
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-6">$9</div>
                <p className="text-indigo-200 mb-6">
                  For professional creators
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Unlimited designs
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Premium templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Multiple export formats
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">$49</div>
                <p className="text-gray-600 mb-6">For teams and businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  24/7 support
                </li>
              </ul>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-indigo-200 mb-8">
            Join thousands of creators who trust Matty for their design needs
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="text-2xl font-bold text-indigo-400 mb-4">
                Matty
              </div>
              <p className="text-gray-400">
                Making professional design accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Matty AI-Design Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

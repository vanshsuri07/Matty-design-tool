import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

// You might need to install these dependencies if you haven't already:
// npm install framer-motion lucide-react

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation logic (unchanged)
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full bg-gray-800/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Left Panel: Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-slate-900 to-gray-800">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Matty</h1>
          <p className="text-xl text-slate-300">Unlock Your Creativity.</p>
          <p className="mt-2 text-slate-400">
            Join a community of designers and build your next masterpiece with
            us.
          </p>
        </div>

        {/* Right Panel: Registration Form */}
        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-white">
                Create Your Account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Let's get you started!
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-coral-500 transition-all"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-coral-500 transition-all"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/70 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-coral-500 transition-all"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/70 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-coral-500 transition-all"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center pt-1">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-coral-600 hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-coral-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-coral-500 hover:text-coral-400"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;

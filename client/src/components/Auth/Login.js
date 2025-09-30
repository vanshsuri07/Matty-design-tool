import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // In a real app, this would redirect to a protected route.
      // For this example, we'll just log success.
      console.log("Login successful, navigating to dashboard...");
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
          <h1 className="text-4xl font-bold tracking-tighter mb-4">
            Welcome Back
          </h1>
          <p className="text-xl text-slate-300">
            Sign in to continue to Matty.
          </p>
          <p className="mt-2 text-slate-400">
            Your journey of creativity and design awaits. Let's pick up where
            you left off.
          </p>
        </div>

        {/* Right Panel: Login Form */}
        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-white">Sign In</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your credentials to access your account.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="current-password"
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
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="/dashboard"
                    className="font-medium text-coral-500 hover:text-coral-400"
                  >
                    Forgot your password?
                  </a>
                </div>
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
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-coral-500 hover:text-coral-400"
                  >
                    Register here
                  </Link>
                             {" "}
                </p>
                         {" "}
              </div>
                     {" "}
            </form>
          </motion.div>
        </div>
      </div>
         {" "}
    </div>
  );
};

export default Login;

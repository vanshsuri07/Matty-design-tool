import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { designAPI } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  LayoutGrid,
  AlertTriangle,
  LogOut,
  TrendingUp,
  Star,
  Eye,
  Heart,
  MoreVertical,
  Sparkles,
  Copy,
  Edit,
  Trash2,
} from "lucide-react";

const trendingDesignsData = [
  {
    id: "t1",
    name: "Modern Portfolio Template",
    category: "Portfolio",
    views: "12.5K",
    likes: "2.3K",
    previewUrl: "https://placehold.co/600x400/8B5CF6/FFFFFF?text=Portfolio",
    author: "Sarah Chen",
    trending: true,
  },
  {
    id: "t2",
    name: "SaaS Landing Page Pro",
    category: "Landing Page",
    views: "18.2K",
    likes: "3.8K",
    previewUrl: "https://placehold.co/600x400/EC4899/FFFFFF?text=SaaS+Pro",
    author: "Alex Rivera",
    trending: true,
  },
  {
    id: "t3",
    name: "E-commerce Product Grid",
    category: "E-commerce",
    views: "9.7K",
    likes: "1.9K",
    previewUrl: "https://placehold.co/600x400/F59E0B/FFFFFF?text=Ecommerce",
    author: "Maya Patel",
    trending: true,
  },
  {
    id: "t4",
    name: "Mobile App Showcase",
    category: "Mobile",
    views: "15.4K",
    likes: "2.8K",
    previewUrl: "https://placehold.co/600x400/10B981/FFFFFF?text=Mobile+App",
    author: "James Wilson",
    trending: true,
  },
  {
    id: "t5",
    name: "Minimalist Brand Identity",
    category: "Branding",
    views: "11.3K",
    likes: "2.5K",
    previewUrl: "https://placehold.co/600x400/3B82F6/FFFFFF?text=Branding",
    author: "Emma Thompson",
    trending: true,
  },
  {
    id: "t6",
    name: "Dashboard Analytics UI",
    category: "Dashboard",
    views: "14.8K",
    likes: "3.2K",
    previewUrl: "https://placehold.co/600x400/EF4444/FFFFFF?text=Analytics",
    author: "David Kim",
    trending: true,
  },
];

// --- TRENDING DESIGN CARD ---
const TrendingCard = ({ design, onUseTemplate }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trending Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
        <TrendingUp size={12} />
        Trending
      </div>

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={design.previewUrl}
          alt={design.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onUseTemplate(design.id)}
            className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-coral-500 hover:text-white transition-all duration-200 transform hover:scale-105"
          >
            Use Template
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg truncate group-hover:text-coral-400 transition-colors">
              {design.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">by {design.author}</p>
          </div>
          <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full">
            {design.category}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {design.views}
            </span>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-red-400" : "hover:text-red-400"
              }`}
            >
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              {design.likes}
            </button>
          </div>
          <Star size={16} className="text-yellow-400" fill="currentColor" />
        </div>
      </div>
    </motion.div>
  );
};

// --- MY DESIGN CARD ---
const DesignCard = ({ design, onEdit, onDelete, onDuplicate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = React.useRef(null);
  const menuRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <motion.div
      className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group overflow-hidden rounded-t-lg">
        <img
          src={design.thumbnailUrl}
          alt={design.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => onEdit(design._id)}
            className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-coral-500 hover:text-white transition-all duration-200"
          >
            Edit Design
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{design.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Created {timeAgo(design.createdAt)}
            </p>
          </div>

          {/* Menu Button and Dropdown - FIXED VERSION */}
          <div className="relative z-50 flex-shrink-0">
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {/* Dropdown positioned to overlay properly */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-[100]"
                >
                  <button
                    onClick={() => {
                      onEdit(design._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-t-lg"
                  >
                    <Edit size={14} className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(design._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                  >
                    <Copy size={14} className="mr-2" /> Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDelete(design._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-b-lg"
                  >
                    <Trash2 size={14} className="mr-2" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await designAPI.getAll();
      if (response.data.success) {
        setDesigns(response.data.designs);
      }
    } catch (error) {
      setError("Failed to load designs. Please try again.");
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDesign = async (designId) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await designAPI.delete(designId);
        setDesigns(designs.filter((design) => design._id !== designId));
      } catch (error) {
        console.error("Error deleting design:", error);
        alert("Failed to delete design");
      }
    }
  };

  const handleDuplicateDesign = async (designId) => {
    try {
      const response = await designAPI.duplicate(designId);
      if (response.data.success) {
        setDesigns([response.data.design, ...designs]);
      }
    } catch (error) {
      console.error("Error duplicating design:", error);
      alert("Failed to duplicate design");
    }
  };

  const handleEditDesign = (designId) => {
    navigate(`/editor/${designId}`);
  };

  const handleCreateNew = () => {
    navigate("/editor");
  };

  const handleUseTemplate = (templateId) => {
    console.log(`Using template: ${templateId}`);
    navigate(`/editor?template=${templateId}`);
  };

  const renderMyDesigns = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg animate-pulse"
            >
              <div className="w-full h-48 bg-slate-700"></div>
              <div className="p-4">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-white">
            Something went wrong
          </h3>
          <p className="mt-1 text-sm text-slate-400">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchDesigns}
              className="text-sm font-semibold text-coral-500 hover:text-coral-400"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    if (designs.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
          <LayoutGrid className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-white">
            No Designs Yet
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Get started by creating your first design.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center bg-coral-600 hover:bg-coral-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <Plus size={20} className="-ml-1 mr-2" />
              Create Your First Design
            </button>
          </div>
        </div>
      );
    }
    return (
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <DesignCard
              key={design._id}
              design={design}
              onEdit={handleEditDesign}
              onDelete={handleDeleteDesign}
              onDuplicate={handleDuplicateDesign}
            />
          ))}
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-coral-500 to-pink-500 bg-clip-text text-transparent">
                Matty
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300 hidden sm:block">
                Welcome, {user?.fullName}
              </span>
              <button
                onClick={logout}
                className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                <LogOut size={16} className="mr-2 sm:mr-0" />
                <span className="sm:hidden">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg">
                <Sparkles className="text-orange-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Trending Designs
                </h2>
                <p className="text-sm text-slate-400">
                  Popular templates from the community
                </p>
              </div>
            </div>
            <button className="text-sm text-coral-400 hover:text-coral-300 font-medium">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDesignsData.map((design) => (
              <TrendingCard
                key={design.id}
                design={design}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        </section>

        {/* My Designs Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">My Designs</h2>
              <p className="mt-1 text-sm text-slate-400">
                Create and manage your design projects below.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center justify-center bg-gradient-to-r from-coral-600 to-pink-600 hover:from-coral-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-coral-900/30"
            >
              <Plus size={20} className="-ml-1 mr-2" />
              Create New Design
            </button>
          </div>

          {renderMyDesigns()}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

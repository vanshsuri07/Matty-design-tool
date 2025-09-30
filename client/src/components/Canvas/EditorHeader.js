import React from "react";
import { Link } from "react-router-dom";
import { Undo, Redo, ZoomIn, ZoomOut, Share2, Save } from "lucide-react";

export const EditorHeader = ({
  designTitle,
  setDesignTitle,
  lastSaved,
  isSaving,
  saveDesign,
  onAction,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 shadow-sm flex items-center justify-between z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white font-bold text-xl"
        >
          M
        </Link>
        <div>
          <input
            type="text"
            value={designTitle}
            onChange={(e) => setDesignTitle(e.target.value)}
            className="text-base font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-2 py-1 -ml-2"
          />
          <p className="text-xs text-slate-500">
            {lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString()}`
              : "Unsaved changes"}
          </p>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => onAction("undo")}
          disabled={!canUndo}
          className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => onAction("redo")}
          disabled={!canRedo}
          className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <Redo size={18} />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        <button
          onClick={() => onZoomChange(zoom - 0.1)}
          className="p-2 rounded-md hover:bg-slate-200 transition-colors"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm font-medium text-slate-600 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(zoom + 0.1)}
          className="p-2 rounded-md hover:bg-slate-200 transition-colors"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
          <Share2 size={16} />
          <span>Share</span>
        </button>
        <button
          onClick={saveDesign}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 font-medium flex items-center gap-2"
        >
          <Save size={16} />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>
    </div>
  );
};

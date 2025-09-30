import React, { useState } from "react";

const DesignCardWithPortal = ({ design, onEdit, onDelete, onDuplicate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEdit = () => {
    onEdit(design._id);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(design._id);
    setIsMenuOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate(design._id);
    setIsMenuOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {design.thumbnailUrl ? (
          <img
            src={design.thumbnailUrl}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
            {design.title}
          </h3>
          <div className="relative ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Created {formatDate(design.createdAt)}
        </p>
      </div>

      {/* Click to edit */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleEdit}
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default DesignCardWithPortal;

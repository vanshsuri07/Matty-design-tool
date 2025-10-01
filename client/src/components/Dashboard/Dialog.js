// components/Dialog.jsx
import React from "react";

const Dialog = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-slate-800">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Dialog box */}
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6 z-10">
        {/* Header */}
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        {/* Body */}
        <div className="mb-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
};

export default Dialog;

import React, { useState, useEffect } from "react";
import { X, Link as LinkIcon, Check, Globe, Lock } from "lucide-react";
import { designAPI } from "../../services/api";

const ShareModal = ({
  isOpen,
  onClose,
  id,
  designTitle,
  currentAccess = "private",
}) => {
  const [access, setAccess] = useState(currentAccess);
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset access when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setAccess(currentAccess);
    }
  }, [isOpen, currentAccess]);

  if (!isOpen) return null;

  // Validate that we have a design ID
  if (!id) {
    console.error("ShareModal: No design ID provided");
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Unable to Share
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-slate-600">
            Please save your design before sharing. Once saved, you'll be able
            to share it with others.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/view/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link to clipboard");
    }
  };

  const handleAccessChange = async (newAccess) => {
    if (!id) {
      console.error("Cannot update access: No design ID");
      return;
    }

    setIsUpdating(true);
    try {
      console.log(`Updating access for design ${id} to ${newAccess}`);
      const response = await designAPI.updateAccess(id, newAccess);

      if (response.data.success) {
        setAccess(newAccess);
        console.log("Access updated successfully");
      }
    } catch (err) {
      console.error("Failed to update access:", err);
      alert("Failed to update sharing settings. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            Share "{designTitle || "Untitled Design"}"
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Access Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Who can access
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleAccessChange("private")}
                disabled={isUpdating}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  access === "private"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      access === "private"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Lock size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Private</div>
                    <div className="text-sm text-slate-500">
                      Only you can access this design
                    </div>
                  </div>
                  {access === "private" && (
                    <Check size={20} className="text-indigo-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => handleAccessChange("public")}
                disabled={isUpdating}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  access === "public"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      access === "public"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Globe size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">
                      Anyone with the link
                    </div>
                    <div className="text-sm text-slate-500">
                      Anyone can view this design
                    </div>
                  </div>
                  {access === "public" && (
                    <Check size={20} className="text-indigo-600" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          {access === "public" && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Share link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <Check size={16} />
                  Link copied to clipboard!
                </p>
              )}
            </div>
          )}

          {access === "private" && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                This design is private. Change access to "Anyone with the link"
                to share it.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

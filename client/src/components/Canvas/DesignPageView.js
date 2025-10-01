import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, FabricImage } from "fabric"; // ✅ FIX: import from fabric, not { Canvas }
import { ArrowLeft } from "lucide-react";
import { designAPI } from "../../services/api";

const DesignViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      selection: false,
    });

    setCanvas(fabricCanvas);

    return () => fabricCanvas.dispose();
  }, []);

  // Fetch design
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        setLoading(true);
        const { data } = await designAPI.getPublicDesign(id);

        if (!data.success) {
          setError(data.message || "Failed to load design");
          return;
        }

        setDesign(data.design);
      } catch (err) {
        console.error("Error fetching design:", err);
        setError("Failed to load design");
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  // Load design into canvas
  useEffect(() => {
    if (!canvas || !design) return;

    try {
      // Resize + background
      canvas.setWidth(design.width || 800);
      canvas.setHeight(design.height || 600);
      canvas.setBackgroundColor(design.backgroundColor || "#ffffff", () =>
        canvas.renderAll()
      );

      // Ensure JSON is parsed correctly
      let jsonData = design.jsonData;
      if (typeof jsonData === "string") {
        jsonData = JSON.parse(jsonData);
      }
      canvas.loadFromJSON(jsonData, () => canvas.renderAll());

      if (jsonData && jsonData.objects && jsonData.objects.length > 0) {
        canvas.loadFromJSON(jsonData, () => {
          // Disable all interactions
          canvas.forEachObject((obj) => {
            obj.selectable = false;
            obj.evented = false;
          });
          canvas.renderAll();
        });
      } else {
        console.warn("No objects in design JSON → showing fallback thumbnail");

        // Fallback: show thumbnail as image if JSON is empty
        if (design.thumbnailUrl) {
          FabricImage.fromURL(design.thumbnailUrl, (img) => {
            canvas.add(img);
            canvas.centerObject(img);
            img.selectable = false;
            canvas.renderAll();
          });
        }
      }
    } catch (err) {
      console.error("Error loading design JSON:", err);
    }
  }, [canvas, design]);

  // Export as PNG
  const handleExport = () => {
    if (!canvas) return alert("Canvas not ready yet");

    try {
      canvas.renderAll();
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 2,
      });

      const link = document.createElement("a");
      link.download = `${design?.title || "design"}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export design. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading design...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Cannot View Design
          </h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                {design.title}
              </h1>
              <p className="text-sm text-slate-500">View-only mode</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            📥 Download
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg">
          <canvas ref={canvasRef} className="border border-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default DesignViewPage;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, FabricImage } from "fabric";
import { ArrowLeft } from "lucide-react";
import { designAPI } from "../../services/api";

const DesignViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Fetch design
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching design with ID:", id);
        const { data } = await designAPI.getPublicDesign(id);

        console.log("API Response:", data);

        if (!data.success) {
          setError(data.message || "Failed to load design");
          return;
        }

        console.log("Design data:", data.design);
        setDesign(data.design);
      } catch (err) {
        console.error("Error fetching design:", err);
        setError(err.response?.data?.message || "Failed to load design");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDesign();
    }
  }, [id]);

  // Initialize canvas - runs after design is loaded and DOM is ready
  useEffect(() => {
    // Only try to initialize after we have design data and ref is available
    if (!design || !canvasRef.current || fabricCanvasRef.current) {
      console.log("Skipping canvas init:", {
        hasDesign: !!design,
        hasCanvasRef: !!canvasRef.current,
        alreadyInit: !!fabricCanvasRef.current,
      });
      return;
    }

    console.log("Initializing canvas with design data...");

    try {
      // Parse JSON data if needed
      let jsonData = design.jsonData;
      if (typeof jsonData === "string") {
        console.log("Parsing JSON string...");
        jsonData = JSON.parse(jsonData);
      }

      // Get canvas dimensions from design
      const width = design.width || jsonData?.width || 800;
      const height = design.height || jsonData?.height || 600;
      const bgColor =
        design.backgroundColor || jsonData?.background || "#ffffff";

      console.log("Canvas dimensions:", { width, height, bgColor });

      // Create Fabric canvas
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: width,
        height: height,
        backgroundColor: bgColor,
        selection: false,
        renderOnAddRemove: true,
      });

      fabricCanvasRef.current = fabricCanvas;
      console.log("✓ Canvas created successfully");

      // Load design into canvas
      loadDesignIntoCanvas(fabricCanvas, jsonData, width, height);
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
      setError("Failed to initialize canvas: " + error.message);
    }

    return () => {
      if (fabricCanvasRef.current) {
        console.log("Disposing canvas");
        try {
          fabricCanvasRef.current.dispose();
        } catch (err) {
          console.error("Error disposing canvas:", err);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, [design]); // Only re-run when design changes

  // Load design data into canvas
  const loadDesignIntoCanvas = async (canvas, jsonData, width, height) => {
    try {
      console.log("Loading design into canvas...");
      console.log("Objects count:", jsonData?.objects?.length || 0);

      if (jsonData && jsonData.objects && jsonData.objects.length > 0) {
        console.log("Loading objects from JSON...");

        // Add crossOrigin to all image objects for production
        const objectsWithCORS = jsonData.objects.map((obj) => {
          if (obj.type === "image" && obj.src) {
            return {
              ...obj,
              crossOrigin: "anonymous",
            };
          }
          return obj;
        });

        const modifiedJsonData = {
          ...jsonData,
          objects: objectsWithCORS,
        };

        // Load JSON with promise
        await canvas.loadFromJSON(modifiedJsonData);

        console.log("JSON loaded, configuring objects...");

        // Disable all interactions
        canvas.selection = false;
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
          obj.hasControls = false;
          obj.hasBorders = false;
        });

        // Block selections
        canvas.on("selection:created", () => canvas.discardActiveObject());
        canvas.on("selection:updated", () => canvas.discardActiveObject());

        canvas.requestRenderAll();
        setCanvasReady(true);
        console.log("✓ Design loaded successfully!");
      } else {
        console.warn("No objects in design JSON, loading thumbnail fallback");
        await loadThumbnailFallback(canvas, width, height);
      }
    } catch (err) {
      console.error("Error loading design:", err);
      await loadThumbnailFallback(canvas, width, height);
    }
  };

  // Fallback to thumbnail if JSON fails
  const loadThumbnailFallback = async (canvas, width, height) => {
    if (design.thumbnailUrl) {
      console.log("Loading thumbnail fallback...");
      try {
        const img = await FabricImage.fromURL(design.thumbnailUrl, {
          crossOrigin: "anonymous",
        });

        const scale = Math.min(width / img.width, height / img.height);
        img.scale(scale);

        canvas.add(img);
        canvas.centerObject(img);
        img.selectable = false;
        img.evented = false;
        canvas.requestRenderAll();
        setCanvasReady(true);
        console.log("✓ Thumbnail loaded as fallback");
      } catch (err) {
        console.error("Failed to load thumbnail:", err);
        setError("Failed to load design");
      }
    } else {
      console.error("No thumbnail available");
      setError("Design data is empty");
    }
  };

  // Export as PNG
  const handleExport = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvasReady) {
      alert("Canvas not ready yet");
      return;
    }

    try {
      canvas.requestRenderAll();

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

      console.log("✓ Design exported successfully");
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
                {design?.title || "Untitled Design"}
              </h1>
              <p className="text-sm text-slate-500">
                {canvasReady ? "View-only mode" : "Loading canvas..."}
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={!canvasReady}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canvasReady
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            📥 Download
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4">
          {!canvasReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Rendering design...</p>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="border border-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default DesignViewPage;

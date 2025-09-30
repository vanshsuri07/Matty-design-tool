import React, { useState, useEffect, useRef } from "react";
import {
  Canvas,
  IText,
  Rect,
  Circle,
  Triangle,
  Line,
  FabricImage,
} from "fabric";
import Toolbar from "./Toolbar";
// Make sure to import the new header
import { EditorHeader } from "./EditorHeader";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import { designAPI } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const CanvasEditor = () => {
  // All your existing state and refs remain the same
  const { id } = useParams();
  const navigate = useNavigate();
  const [lastSaved, setLastSaved] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [designTitle, setDesignTitle] = useState("Untitled Design");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1); // Start at -1 for initial state
  const [zoom, setZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [designData, setDesignData] = useState(null);
  const [activeTool, setActiveTool] = useState("move");
  const [copiedObject, setCopiedObject] = useState(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    fabricCanvas.on("selection:created", (e) =>
      setSelectedObject(e.selected[0])
    );
    fabricCanvas.on("selection:updated", (e) =>
      setSelectedObject(e.selected[0])
    );
    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

    setCanvas(fabricCanvas);

    return () => fabricCanvas.dispose();
  }, []);

  useEffect(() => {
    if (!canvas || !id) return;
    const fetchDesign = async () => {
      try {
        const response = await designAPI.getById(id);
        if (response.data.success && response.data.design) {
          const { title, jsonData } = response.data.design;
          setDesignTitle(title);
          await canvas.loadFromJSON(jsonData);
          canvas.renderAll();
          saveHistory(); // Save fetched state as initial history
        }
      } catch (error) {
        console.error("Error loading design:", error);
      }
    };
    fetchDesign();
  }, [canvas, id]);

  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = activeTool === "pen";
  }, [activeTool, canvas]);

  const saveHistory = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory((prev) => [...prev.slice(0, historyStep + 1), json]);
    setHistoryStep((prev) => prev + 1);
  };

  const handleToolChange = (tool) => {
    setActiveTool(tool);
  };

  const handleAction = (action) => {
    const tools = [
      "move",
      "rectangle",
      "circle",
      "line",
      "text",
      "pen",
      "frame",
    ];
    if (tools.includes(action)) {
      handleToolChange(action);
      return;
    }

    if (!canvas) return;

    switch (action) {
      case "text":
        const text = new IText("Add your text", {
          left: 100,
          top: 100,
          fontSize: 32,
          fill: "#000000",
          fontFamily: "Arial",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        break;

      case "heading":
        const heading = new IText("Your Heading", {
          left: 100,
          top: 100,
          fontSize: 48,
          fill: "#000000",
          fontFamily: "Arial",
          fontWeight: "bold",
        });
        canvas.add(heading);
        canvas.setActiveObject(heading);
        break;

      case "rectangle":
        const rect = new Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: "#3b82f6",
          stroke: "#1e40af",
          strokeWidth: 2,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        break;

      case "circle":
        const circle = new Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: "#ef4444",
          stroke: "#dc2626",
          strokeWidth: 2,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        break;

      case "triangle":
        const triangle = new Triangle({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          fill: "#10b981",
          stroke: "#059669",
          strokeWidth: 2,
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        break;

      case "line":
        const line = new Line([50, 50, 250, 50], {
          stroke: "#000000",
          strokeWidth: 3,
        });
        canvas.add(line);
        canvas.setActiveObject(line);
        break;
      case "frame":
        const frame = new Rect({
          left: 100,
          top: 100,
          width: 300,
          height: 200,
          fill: "transparent",
          stroke: "#000000",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
        });
        canvas.add(frame);
        canvas.setActiveObject(frame);
        break;

      case "image":
        fileInputRef.current?.click();
        break;

      case "duplicate":
        if (selectedObject) {
          selectedObject.clone((cloned) => {
            cloned.set({ left: cloned.left + 20, top: cloned.top + 20 });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
          });
        }
        break;

      case "delete":
        if (selectedObject) {
          canvas.remove(selectedObject);
          setSelectedObject(null);
        }
        break;

      case "copy":
        if (selectedObject) {
          selectedObject.clone((cloned) => {
            setCopiedObject(cloned);
          });
        }
        break;
      case "paste":
        if (copiedObject) {
          copiedObject.clone((cloned) => {
            cloned.set({
              left: cloned.left + 20,
              top: cloned.top + 20,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
          });
        }
        break;

      case "clear":
        canvas.clear();
        canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));

        break;

      case "export":
        const dataURL = canvas.toDataURL({ format: "png", quality: 1.0 });
        const link = document.createElement("a");
        link.download = `${designTitle}.png`;
        link.href = dataURL;
        link.click();
        break;

      case "undo":
        if (historyStep > 0) {
          const newStep = historyStep - 1;

          canvas
            .loadFromJSON(history[newStep])
            .then(() => {
              canvas.renderAll();
              setHistoryStep(newStep);
              console.log("Undo to step", newStep);
            })
            .catch((err) => {
              console.error("Undo failed:", err);
            });
        }
        break;

      case "redo":
        if (historyStep < history.length - 1) {
          const newStep = historyStep + 1;

          canvas
            .loadFromJSON(history[newStep])
            .then(() => {
              canvas.renderAll();
              setHistoryStep(newStep);
              console.log("Redo to step", newStep);
            })
            .catch((err) => {
              console.error("Redo failed:", err);
            });
        }
        break;

      case "alignLeft":
        if (selectedObject) {
          selectedObject.set({ left: 0 });
          canvas.renderAll();
        }
        break;

      case "alignCenter":
        if (selectedObject) {
          selectedObject.set({
            left:
              (canvas.width - selectedObject.width * selectedObject.scaleX) / 2,
          });
          canvas.renderAll();
        }
        break;

      case "alignRight":
        if (selectedObject) {
          selectedObject.set({
            left: canvas.width - selectedObject.width * selectedObject.scaleX,
          });
          canvas.renderAll();
        }
        break;

      default:
        // No action for unknown cases
        break;
    }

    saveHistory();
    canvas.renderAll();
  };

  // ... (Paste your saveDesign, handleImageUpload, handleZoomChange, etc. here)
  const saveDesign = async () => {
    if (!canvas) return;

    try {
      setIsSaving(true);
      const jsonData = canvas.toJSON();

      // Generate thumbnail (base64 image)
      const thumbnailDataURL = canvas.toDataURL({
        format: "jpeg",
        quality: 0.8,
        multiplier: 0.3, // Smaller thumbnail
      });

      const designData = {
        title: designTitle,
        jsonData,
        thumbnailUrl: thumbnailDataURL, // In real app, upload to Cloudinary
      };

      let response;
      if (id) {
        // Update existing design
        response = await designAPI.update(id, designData);
      } else {
        // Create new design
        response = await designAPI.create(designData);
      }

      if (response.data.success) {
        setLastSaved(new Date());
        if (!id) {
          // Redirect to edit mode for new design
          navigate(`/editor/${response.data.design._id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Failed to save design");
    } finally {
      setIsSaving(false);
    }
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) {
      console.warn("No file selected or canvas not ready.");
      return;
    }

    console.log("Selected file:", file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        console.log("FileReader loaded, attempting FabricImage.fromURL...");

        const img = await FabricImage.fromURL(event.target.result);

        console.log("Image successfully loaded into Fabric:", img);

        img.scale(0.5);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveHistory();

        console.log("Image added to canvas and history saved.");
      } catch (err) {
        console.error("Error loading image into Fabric:", err);
      }
    };

    reader.onerror = (err) => {
      console.error("Error reading file:", err);
    };

    reader.readAsDataURL(file);
  };

  const handleZoomChange = (newZoom) => {
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    setZoom(clampedZoom);
    canvas?.setZoom(clampedZoom);
    canvas?.renderAll();
  };
  // In your editor/canvas component
  console.log("Template data:", designData?.content);
  const loadTemplateData = (templateData) => {
    if (!canvas) return;

    try {
      // Parse string JSON if needed
      const parsedData =
        typeof templateData === "string"
          ? JSON.parse(templateData)
          : templateData;

      // Clear and reset background
      canvas.clear();
      canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));

      // Load template into canvas
      canvas.loadFromJSON(parsedData, () => {
        // Reset zoom and pan so content is visible
        canvas.setZoom(1);
        canvas.absolutePan({ x: 0, y: 0 });

        canvas.renderAll();
        console.log("Template loaded successfully!");
      });
    } catch (err) {
      console.error("Error loading template:", err, templateData);
    }
  };

  // When receiving template data
  useEffect(() => {
    if (designData?.content) {
      loadTemplateData(designData.content);
    }
  }, [designData]);

  return (
    <div className="h-screen flex flex-col bg-white font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Use the new unified header */}
      <EditorHeader
        designTitle={designTitle}
        setDesignTitle={setDesignTitle}
        lastSaved={lastSaved}
        isSaving={isSaving}
        saveDesign={saveDesign}
        onAction={handleAction}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
        zoom={zoom}
        onZoomChange={handleZoomChange}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar
          onAction={handleAction}
          hasSelection={!!selectedObject}
          activeTool={activeTool}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
          canPaste={!!copiedObject}
        />

        {/* Optional Layers Panel */}
        <LayersPanel
          canvas={canvas}
          selectedObject={selectedObject}
          onSelectObject={(obj) => canvas?.setActiveObject(obj).renderAll()}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-slate-100">
          <div
            className="canvas-container bg-white rounded-md shadow-md"
            // This style dynamically adjusts for zoom
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            <canvas ref={canvasRef} className="border border-slate-300" />
          </div>
        </main>

        {/* Right Properties Panel */}
        <PropertiesPanel selectedObject={selectedObject} canvas={canvas} />
      </div>
    </div>
  );
};

export default CanvasEditor;

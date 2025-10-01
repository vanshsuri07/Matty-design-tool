import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Canvas,
  IText,
  Rect,
  Circle,
  Triangle,
  Line,
  FabricImage,
  PencilBrush,
} from "fabric";
import Toolbar from "./Toolbar";
import { EditorHeader } from "./EditorHeader";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import { designAPI } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { mockTemplates } from "../../utils/mocktemplates";

const CanvasEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lastSaved, setLastSaved] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [designTitle, setDesignTitle] = useState("Untitled Design");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [designData, setDesignData] = useState(null);
  const [activeTool, setActiveTool] = useState("move");
  const [isLoading, setIsLoading] = useState(false);

  // Refs to track loading state
  const hasLoadedRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 650,
      height: 500,
      backgroundColor: "#ffffff",
    });

    // Initialize the PencilBrush for drawing
    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.width = 3;
    fabricCanvas.freeDrawingBrush.color = "#000000";

    fabricCanvas.on("selection:created", (e) =>
      setSelectedObject(e.selected[0])
    );
    fabricCanvas.on("selection:updated", (e) =>
      setSelectedObject(e.selected[0])
    );
    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

    // Listen for path creation (when pen drawing is finished)
    fabricCanvas.on("path:created", () => {
      if (hasLoadedRef.current && !isInitialLoadRef.current) {
        saveHistory();
      }
    });

    setCanvas(fabricCanvas);

    return () => fabricCanvas.dispose();
  }, []);

  // Memoize saveHistory
  const saveHistory = useCallback(() => {
    if (!canvas || isInitialLoadRef.current) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory((prev) => [...prev.slice(0, historyStep + 1), json]);
    setHistoryStep((prev) => prev + 1);
  }, [canvas, historyStep]);

  // Load design on mount
  useEffect(() => {
    if (!canvas || hasLoadedRef.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get("template");

    const loadCanvas = async () => {
      setIsLoading(true);
      isInitialLoadRef.current = true;

      try {
        // Priority 1: Load template
        if (templateId && mockTemplates) {
          const template = mockTemplates.find((t) => t._id === templateId);
          if (template?.data) {
            console.log("📄 Loading template:", template.title);
            canvas.clear();
            await canvas.loadFromJSON(template.data);
            canvas.requestRenderAll();
            setDesignTitle(template.title + " (Copy)");

            // Save initial state to history
            const initialState = JSON.stringify(canvas.toJSON());
            setHistory([initialState]);
            setHistoryStep(0);

            hasLoadedRef.current = true;
            isInitialLoadRef.current = false;
            console.log("✓ Template loaded successfully");
            setIsLoading(false);
            return;
          }
        }

        // Priority 2: Load saved design
        if (id) {
          console.log("🔄 Fetching design with ID:", id);
          const response = await designAPI.getById(id);

          console.log("📦 Full response:", response);
          console.log("📦 Response.data:", response.data);
          console.log(
            "📦 Response.data keys:",
            Object.keys(response.data || {})
          );
          console.log("📦 Response.data.design:", response.data?.design);
          console.log("📦 Response.data.data:", response.data?.data);

          // Try multiple possible structures
          let design = null;

          // Check various possible response structures
          if (response?.data?.design) {
            design = response.data.design;
            console.log("✓ Found design in response.data.design");
          } else if (response?.data?.designs && response.data.designs[0]) {
            design = response.data.designs[0];
            console.log("✓ Found design in response.data.designs[0]");
          } else if (response?.data) {
            // Check if response.data itself has the design fields
            if (response.data.title || response.data.jsonData) {
              design = response.data;
              console.log("✓ Found design directly in response.data");
            }
          }

          console.log("📦 Final design object:", design);

          if (design && design.jsonData) {
            const { title, jsonData, updatedAt } = design;

            console.log("📄 Loading saved design:", title);
            console.log("📊 Design jsonData type:", typeof jsonData);
            console.log("📊 Design jsonData:", jsonData);

            setDesignTitle(title || "Untitled Design");
            if (updatedAt) {
              setLastSaved(new Date(updatedAt));
            }

            canvas.clear();
            await canvas.loadFromJSON(jsonData);
            canvas.requestRenderAll();

            // Save initial state to history
            const initialState = JSON.stringify(canvas.toJSON());
            setHistory([initialState]);
            setHistoryStep(0);

            hasLoadedRef.current = true;
            isInitialLoadRef.current = false;
            console.log("✓ Design loaded successfully");
          } else {
            console.error("❌ Could not find design data in response");
            console.error(
              "❌ Response structure:",
              JSON.stringify(response.data, null, 2)
            );
          }
        }
      } catch (error) {
        console.error("❌ Error loading canvas:", error);
        alert("Failed to load design. Please try again.");
      } finally {
        setIsLoading(false);
        // Add a small delay before allowing auto-save
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 1000);
      }
    };

    loadCanvas();
  }, [canvas, id, mockTemplates]);

  // Reset load flag when design ID changes
  useEffect(() => {
    hasLoadedRef.current = false;
    isInitialLoadRef.current = true;
  }, [id]);

  // Auto-save with proper debouncing
  useEffect(() => {
    // Don't auto-save if:
    // - Canvas not ready
    // - No design ID (new design)
    // - Haven't loaded yet
    // - Still in initial load phase
    // - Currently saving
    if (
      !canvas ||
      !id ||
      !hasLoadedRef.current ||
      isInitialLoadRef.current ||
      isSaving ||
      isLoading
    ) {
      return;
    }

    // const autoSave = async () => {
    //   try {
    //     console.log("💾 Auto-saving...");
    //     const jsonData = canvas.toJSON();
    //     const thumbnail = canvas.toDataURL({ format: "png", quality: 0.8 });

    //     await designAPI.update(id, {
    //       title: designTitle,
    //       jsonData: jsonData,
    //       thumbnailUrl: thumbnail,
    //     });

    //     setLastSaved(new Date());
    //     console.log("✓ Auto-saved at", new Date().toLocaleTimeString());
    //   } catch (error) {
    //     console.error("❌ Auto-save failed:", error);
    //   }
    // };

    // const timeoutId = setTimeout(autoSave, 3000);

    return;
  }, [canvas, id, designTitle, historyStep, isSaving, isLoading]);

  const handleAction = (action) => {
    const tools = [
      "move",
      "rectangle",
      "circle",
      "triangle",
      "line",
      "text",
      "pen",
      "frame",
      "image",
    ];
    if (tools.includes(action)) {
      setActiveTool(action);
    }

    if (!canvas) return;

    switch (action) {
      case "move":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;

      case "pen":
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = 3;
          canvas.freeDrawingBrush.color = "#000000";
        }
        break;

      case "frame":
        canvas.isDrawingMode = false;
        const frame = new Rect({
          left: 100,
          top: 100,
          width: 400,
          height: 300,
          fill: "transparent",
          stroke: "#6366f1",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
        });
        canvas.add(frame);
        canvas.setActiveObject(frame);
        break;

      case "text":
        canvas.isDrawingMode = false;
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
        canvas.isDrawingMode = false;
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
        canvas.isDrawingMode = false;
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
        canvas.isDrawingMode = false;
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
        canvas.isDrawingMode = false;
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
        canvas.isDrawingMode = false;
        const line = new Line([50, 50, 250, 50], {
          stroke: "#000000",
          strokeWidth: 3,
        });
        canvas.add(line);
        canvas.setActiveObject(line);
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
          selectedObject
            .clone()
            .then((cloned) => {
              const json = JSON.stringify(cloned.toJSON());
              navigator.clipboard.writeText(json);
              console.log("Object copied to clipboard:", json);
            })
            .catch((err) => {
              console.error("Clone failed:", err);
            });
        }
        break;

      case "clear":
        canvas.clear();
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
          isInitialLoadRef.current = true;
          canvas
            .loadFromJSON(history[newStep])
            .then(() => {
              canvas.renderAll();
              setHistoryStep(newStep);
              console.log("Undo to step", newStep);
              setTimeout(() => {
                isInitialLoadRef.current = false;
              }, 100);
            })
            .catch((err) => {
              console.error("Undo failed:", err);
              isInitialLoadRef.current = false;
            });
        }
        break;

      case "redo":
        if (historyStep < history.length - 1) {
          const newStep = historyStep + 1;
          isInitialLoadRef.current = true;
          canvas
            .loadFromJSON(history[newStep])
            .then(() => {
              canvas.renderAll();
              setHistoryStep(newStep);
              console.log("Redo to step", newStep);
              setTimeout(() => {
                isInitialLoadRef.current = false;
              }, 100);
            })
            .catch((err) => {
              console.error("Redo failed:", err);
              isInitialLoadRef.current = false;
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
        break;
    }

    if (!isInitialLoadRef.current) {
      saveHistory();
    }
    canvas.renderAll();
  };

  const saveDesign = async () => {
    if (!canvas) return;

    try {
      setIsSaving(true);
      console.log("💾 Manual save triggered...");
      const jsonData = canvas.toJSON();

      const thumbnailDataURL = canvas.toDataURL({
        format: "jpeg",
        quality: 0.8,
        multiplier: 0.3,
      });

      const designData = {
        title: designTitle,
        jsonData,
        thumbnailUrl: thumbnailDataURL,
      };

      let response;
      if (id) {
        response = await designAPI.update(id, designData);
        console.log("✓ Design updated successfully");
      } else {
        response = await designAPI.create(designData);
        console.log("✓ New design created successfully");
      }

      if (response.data.success) {
        setLastSaved(new Date());
        if (!id) {
          // Remove template query parameter when navigating to saved design
          navigate(`/editor/${response.data.design._id}`, { replace: true });
        } else {
          // If updating existing design, also clean URL of any template param
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has("template")) {
            navigate(`/editor/${id}`, { replace: true });
          }
        }
      }
    } catch (error) {
      console.error("❌ Error saving design:", error);
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

        if (!isInitialLoadRef.current) {
          saveHistory();
        }

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

  const loadTemplateData = (templateData) => {
    if (!canvas) return;

    try {
      const parsedData =
        typeof templateData === "string"
          ? JSON.parse(templateData)
          : templateData;

      canvas.clear();
      canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));

      canvas.loadFromJSON(parsedData, () => {
        canvas.setZoom(1);
        canvas.absolutePan({ x: 0, y: 0 });
        canvas.renderAll();
        console.log("Template loaded successfully!");
      });
    } catch (err) {
      console.error("Error loading template:", err, templateData);
    }
  };

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

      <EditorHeader
        designId={id}
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
        <Toolbar
          onAction={handleAction}
          hasSelection={!!selectedObject}
          activeTool={activeTool}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
        />

        <LayersPanel
          canvas={canvas}
          selectedObject={selectedObject}
          onSelectObject={(obj) => canvas?.renderAll()}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-slate-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <div className="text-lg font-semibold">Loading design...</div>
            </div>
          )}
          <div
            className="canvas-container bg-white rounded-md shadow-md"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
          >
            <canvas ref={canvasRef} className="border border-slate-300" />
          </div>
        </main>

        <PropertiesPanel selectedObject={selectedObject} canvas={canvas} />
      </div>
    </div>
  );
};

export default CanvasEditor;

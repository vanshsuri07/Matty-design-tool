import * as React from "react";
import { useState, useEffect } from "react";
import {
  Layers,
  Type,
  Square,
  Circle,
  Triangle,
  Minus,
  ImageIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

// Helper to get the correct icon for each layer type
const getLayerIcon = (type) => {
  switch (type) {
    case "i-text":
      return <Type size={16} />;
    case "rect":
      return <Square size={16} />;
    case "circle":
      return <Circle size={16} />;
    case "triangle":
      return <Triangle size={16} />;
    case "line":
      return <Minus size={16} />;
    case "image":
      return <ImageIcon size={16} />;
    default:
      return <Layers size={16} />;
  }
};

const LayersPanel = ({ canvas, selectedObject, onSelectObject }) => {
  const [layers, setLayers] = useState([]);

  // This effect synchronizes the panel with the canvas state
  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects().map((obj, index) => ({
        id: index,
        name: obj.name || `${obj.type} #${index + 1}`,
        type: obj.type,
        visible: obj.visible,
        locked: !obj.selectable,
        object: obj,
      }));
      setLayers(objects);
    };

    // Initial load and event listeners
    updateLayers();
    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [canvas]);

  // Toggle layer visibility
  const toggleVisibility = (e, layer) => {
    e.stopPropagation(); // Prevent layer selection when clicking the icon
    layer.object.set("visible", !layer.visible);
    canvas.renderAll();
    setLayers((prev) =>
      prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
    );
  };

  // Toggle layer lock state
  const toggleLock = (e, layer) => {
    e.stopPropagation();
    layer.object.set("selectable", layer.locked);
    layer.object.set("evented", layer.locked);
    canvas.discardActiveObject().renderAll();
    setLayers((prev) =>
      prev.map((l) => (l.id === layer.id ? { ...l, locked: !l.locked } : l))
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-slate-200">
        <Layers size={16} className="text-slate-500" />
        <h3 className="font-semibold text-sm text-slate-800">Layers</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm h-full flex flex-col items-center justify-center">
            <Layers size={32} className="text-slate-300 mb-4" />
            <p className="font-medium">No Layers Yet</p>
            <p className="text-xs text-slate-400">
              Add objects to see them here.
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {layers
              .slice()
              .reverse()
              .map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => !layer.locked && onSelectObject(layer.object)}
                  className={`p-2 rounded-lg flex items-center justify-between group transition-colors ${
                    selectedObject === layer.object
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-slate-100 text-slate-700"
                  } ${layer.locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3 flex-1 truncate">
                    <span className="flex-shrink-0">
                      {getLayerIcon(layer.type)}
                    </span>
                    <span className="text-sm truncate" title={layer.name}>
                      {layer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => toggleLock(e, layer)}
                      className="p-1 rounded hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    <button
                      onClick={(e) => toggleVisibility(e, layer)}
                      className="p-1 rounded hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default LayersPanel;

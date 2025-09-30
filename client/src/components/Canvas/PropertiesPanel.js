import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Move,
  Type,
  Palette,
  Layers,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCw,
  RectangleHorizontal,
} from "lucide-react";

// Helper Component: Accordion Section
const AccordionSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-slate-500" />
          <span className="font-semibold text-sm text-slate-800">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  );
};

// Helper Component: Styled Number Input
const PropertyInput = ({ label, value, onChange, unit = "" }) => (
  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg">
    <span className="text-xs text-slate-500 font-medium w-6 text-center">
      {label}
    </span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className="w-full bg-transparent p-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-r-lg"
    />
    {unit && <span className="text-xs text-slate-400 pr-2">{unit}</span>}
  </div>
);

// Main Properties Panel Component
const PropertiesPanel = ({ selectedObject, canvas }) => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (selectedObject) {
      setProperties({
        fill: selectedObject.get("fill") || "#000000",
        stroke: selectedObject.get("stroke") || "#000000",
        strokeWidth: selectedObject.get("strokeWidth") || 0,
        opacity: selectedObject.get("opacity") || 1,
        angle: Math.round(selectedObject.get("angle") || 0),
        left: Math.round(selectedObject.get("left") || 0),
        top: Math.round(selectedObject.get("top") || 0),
        width: Math.round(selectedObject.getScaledWidth() || 0),
        height: Math.round(selectedObject.getScaledHeight() || 0),
        rx: selectedObject.get("rx") || 0, // Corner radius X
        fontSize: selectedObject.get("fontSize") || 24,
        fontFamily: selectedObject.get("fontFamily") || "Arial",
        fontWeight: selectedObject.get("fontWeight") || "normal",
        textAlign: selectedObject.get("textAlign") || "left",
      });
    }
  }, [selectedObject]);

  const updateProperty = (key, value) => {
    if (!selectedObject || !canvas) return;

    const newProps = { ...properties, [key]: value };
    setProperties(newProps);

    selectedObject.set(key, value);

    // Special handling for corner radius on Rect
    if (key === "rx" && selectedObject.type === "rect") {
      selectedObject.set("ry", value);
    }

    canvas.renderAll();
  };

  const updateDimensions = (key, value) => {
    if (!selectedObject || !canvas) return;

    if (key === "width") {
      selectedObject.scaleToWidth(value);
    } else {
      selectedObject.scaleToHeight(value);
    }

    const newProps = {
      ...properties,
      width: Math.round(selectedObject.getScaledWidth()),
      height: Math.round(selectedObject.getScaledHeight()),
    };
    setProperties(newProps);
    canvas.renderAll();
  };

  if (!selectedObject) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-slate-100 rounded-full">
          <Sparkles size={28} className="text-slate-400" />
        </div>
        <p className="font-semibold text-slate-700 mt-4">Nothing Selected</p>
        <p className="text-sm text-slate-500 mt-1">
          Select an object on the canvas to see its properties.
        </p>
      </div>
    );
  }

  const isText = selectedObject.type === "i-text";
  const isShape = ["rect", "circle", "triangle", "line"].includes(
    selectedObject.type
  );

  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <AccordionSection title="Transform" icon={Move}>
        <div className="grid grid-cols-2 gap-3">
          <PropertyInput
            label="X"
            value={properties.left}
            onChange={(v) => updateProperty("left", v)}
          />
          <PropertyInput
            label="Y"
            value={properties.top}
            onChange={(v) => updateProperty("top", v)}
          />
          <PropertyInput
            label="W"
            value={properties.width}
            onChange={(v) => updateDimensions("width", v)}
          />
          <PropertyInput
            label="H"
            value={properties.height}
            onChange={(v) => updateDimensions("height", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <PropertyInput
              label={<RotateCw size={12} />}
              value={properties.angle}
              onChange={(v) => updateProperty("angle", v)}
              unit="°"
            />
          </div>
          {selectedObject.type === "rect" && (
            <div className="col-span-1">
              <PropertyInput
                label={<RectangleHorizontal size={12} />}
                value={properties.rx}
                onChange={(v) => updateProperty("rx", v)}
              />
            </div>
          )}
        </div>
      </AccordionSection>

      {isText && (
        <AccordionSection title="Text" icon={Type}>
          <select
            value={properties.fontFamily}
            onChange={(e) => updateProperty("fontFamily", e.target.value)}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Georgia</option>
            <option>Verdana</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <PropertyInput
              label="Size"
              value={properties.fontSize}
              onChange={(v) => updateProperty("fontSize", v)}
            />
            <select
              value={properties.fontWeight}
              onChange={(e) => updateProperty("fontWeight", e.target.value)}
              className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div className="flex items-center justify-start gap-2 rounded-lg bg-slate-100 p-1">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() => updateProperty("textAlign", align)}
                className={`p-1.5 rounded-md transition-colors ${
                  properties.textAlign === align
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-slate-500 hover:bg-slate-200"
                }`}
              >
                {align === "left" && <AlignLeft size={16} />}
                {align === "center" && <AlignCenter size={16} />}
                {align === "right" && <AlignRight size={16} />}
              </button>
            ))}
          </div>
        </AccordionSection>
      )}

      <AccordionSection title="Appearance" icon={Palette}>
        {(isShape || isText) && (
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">
              Fill
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={properties.fill}
                onChange={(e) => updateProperty("fill", e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer appearance-none bg-transparent border border-slate-200"
                style={{ backgroundColor: properties.fill }}
              />
              <input
                type="text"
                value={properties.fill}
                onChange={(e) => updateProperty("fill", e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded-lg font-mono bg-slate-50"
              />
            </div>
          </div>
        )}
        {isShape && (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">
                Stroke
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.stroke}
                  onChange={(e) => updateProperty("stroke", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer appearance-none bg-transparent border border-slate-200"
                  style={{ backgroundColor: properties.stroke }}
                />
                <input
                  type="text"
                  value={properties.stroke}
                  onChange={(e) => updateProperty("stroke", e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded-lg font-mono bg-slate-50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">
                Stroke Width
              </label>
              <PropertyInput
                label="W"
                value={properties.strokeWidth}
                onChange={(v) => updateProperty("strokeWidth", v)}
              />
            </div>
          </>
        )}
      </AccordionSection>

      <AccordionSection title="Effects" icon={Layers}>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Opacity
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={properties.opacity}
              onChange={(e) =>
                updateProperty("opacity", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm"
            />
            <span className="text-sm font-medium text-slate-600 w-12 text-center">
              {Math.round(properties.opacity * 100)}%
            </span>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};

export default PropertiesPanel;

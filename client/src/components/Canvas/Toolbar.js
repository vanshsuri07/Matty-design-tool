import { useState } from "react";
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Triangle,
  Minus,
  Pen,
  ImageIcon,
  Trash2,
  Undo,
  Redo,
  Download,
  Eraser,
  Settings,
  RectangleHorizontal,
} from "lucide-react";

const Toolbar = ({ onAction, hasSelection, activeTool, canUndo, canRedo }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const tools = [
    {
      section: "Tools",
      items: [
        { name: "move", icon: MousePointer2, tooltip: "Move / Select (V)" },
        {
          name: "shapes",
          icon: Square,
          tooltip: "Shapes",
          type: "dropdown",
          subItems: [
            { name: "rectangle", icon: Square, tooltip: "Rectangle (R)" },
            { name: "circle", icon: Circle, tooltip: "Circle (C)" },
            { name: "triangle", icon: Triangle, tooltip: "Triangle" },
            { name: "line", icon: Minus, tooltip: "Line (L)" },
          ],
        },
        { name: "pen", icon: Pen, tooltip: "Pen Tool (P)" },
        {
          name: "frame",
          icon: RectangleHorizontal,
          tooltip: "Frame Tool (F)",
        },
        { name: "text", icon: Type, tooltip: "Add Text (T)" },
        { name: "image", icon: ImageIcon, tooltip: "Upload Image (I)" },
      ],
    },
    {
      section: "Actions",
      items: [
        {
          name: "undo",
          icon: Undo,
          tooltip: "Undo (⌘Z)",
          disabled: !canUndo,
        },
        {
          name: "redo",
          icon: Redo,
          tooltip: "Redo (⌘Y)",
          disabled: !canRedo,
        },
        {
          name: "delete",
          icon: Eraser,
          tooltip: "Clear Canvas",
          disabled: !hasSelection,
          danger: true,
        },
      ],
    },
    {
      section: "File",
      items: [
        { name: "clear", icon: Trash2, tooltip: "Delete (Del)", danger: true },
        { name: "export", icon: Download, tooltip: "Export PNG (⌘E)" },
      ],
    },
  ];

  return (
    <div className="w-20 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm relative">
      <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center">
        {tools.map((section, idx) => (
          <div key={section.section} className="mb-2">
            {idx > 0 && <div className="w-10 h-px bg-slate-200 mx-auto my-3" />}
            <div className="space-y-2">
              {section.items.map((tool) => {
                if (tool.type === "dropdown") {
                  const isActive = tool.subItems.some(
                    (item) => item.name === activeTool
                  );
                  return (
                    <div key={tool.name} className="relative">
                      <button
                        onClick={() => {
                          setOpenDropdown(
                            openDropdown === tool.name ? null : tool.name
                          );
                        }}
                        className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                          openDropdown === tool.name || isActive
                            ? "bg-indigo-100 text-indigo-600 shadow-inner"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95"
                        }`}
                      >
                        <tool.icon size={22} />
                      </button>

                      {openDropdown === tool.name && (
                        <div
                          className="fixed bg-white rounded-xl shadow-2xl border border-slate-200 p-2 flex flex-col gap-1"
                          style={{
                            left: "88px",
                            top: "60px",
                            zIndex: 9999,
                          }}
                        >
                          {tool.subItems.map((subTool) => (
                            <div key={subTool.name} className="relative group">
                              <button
                                onClick={() => {
                                  onAction(subTool.name);
                                  setOpenDropdown(null);
                                }}
                                className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                  activeTool === subTool.name
                                    ? "bg-indigo-100 text-indigo-600 shadow-inner"
                                    : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95"
                                }`}
                              >
                                <subTool.icon size={22} />
                              </button>
                              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                                <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">
                                  {subTool.tooltip}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular button
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.name}
                    onClick={() => onAction(tool.name)}
                    disabled={tool.disabled}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                      activeTool === tool.name
                        ? "bg-indigo-100 text-indigo-600 shadow-inner"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                    } ${
                      tool.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "active:scale-95"
                    } ${
                      tool.danger && !tool.disabled
                        ? "hover:text-red-600 hover:bg-red-50"
                        : ""
                    }`}
                  >
                    <Icon size={22} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 mt-auto">
        <div className="w-10 h-px bg-slate-200 mx-auto my-3" />
        <button className="w-14 h-14 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center rounded-xl transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

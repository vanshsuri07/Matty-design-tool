import { useState, useRef, useEffect } from "react";
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
  Copy,
  Clipboard,
} from "lucide-react";

const Toolbar = ({
  onAction,
  hasSelection,
  activeTool,
  canUndo,
  canRedo,
  canPaste,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          name: "copy",
          icon: Copy,
          tooltip: "Copy (⌘C)",
          disabled: !hasSelection,
        },
        {
          name: "paste",
          icon: Clipboard,
          tooltip: "Paste (⌘V)",
          disabled: !canPaste,
        },
        {
          name: "delete",
          icon: Trash2,
          tooltip: "Delete (Del)",
          disabled: !hasSelection,
          danger: true,
        },
      ],
    },
    {
      section: "File",
      items: [
        { name: "clear", icon: Eraser, tooltip: "Clear Canvas", danger: true },
        { name: "export", icon: Download, tooltip: "Export PNG (⌘E)" },
      ],
    },
  ];

  const handleDropdownClick = (toolName) => {
    setOpenDropdown(openDropdown === toolName ? null : toolName);
  };

  const handleAction = (action) => {
    onAction(action);
    setOpenDropdown(null); // Close dropdown after action
  };

  const renderButton = (tool) => (
    <div key={tool.name} className="relative group">
      <button
        onClick={() => handleAction(tool.name)}
        disabled={tool.disabled}
        data-testid={`toolbar-button-${tool.name}`}
        className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
          activeTool === tool.name
            ? "bg-indigo-100 text-indigo-600 shadow-inner"
            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
        } ${
          tool.disabled
            ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-600"
            : "active:scale-95"
        } ${
          tool.danger && !tool.disabled
            ? "hover:text-red-600 hover:bg-red-50"
            : ""
        }`}
      >
        <tool.icon size={22} />
      </button>
      {!tool.disabled && (
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">
            {tool.tooltip}
          </div>
        </div>
      )}
    </div>
  );

  const renderDropdown = (tool) => (
    <div key={tool.name} className="relative" ref={dropdownRef}>
      <div className="relative group">
        <button
          onClick={() => handleDropdownClick(tool.name)}
          data-testid={`toolbar-button-${tool.name}`}
          className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
            openDropdown === tool.name ||
            tool.subItems.some((item) => item.name === activeTool)
              ? "bg-indigo-100 text-indigo-600 shadow-inner"
              : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95"
          }`}
        >
          <tool.icon size={22} />
        </button>
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">
            {tool.tooltip}
          </div>
        </div>
      </div>

      {openDropdown === tool.name && (
        <div className="absolute left-full ml-3 top-0 bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-1 z-40">
          {tool.subItems.map(renderButton)}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-20 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      {/* <div className="p-3">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center cursor-pointer">
          <p className="text-white font-bold text-3xl">M</p>
        </div>
      </div> */}

      <div className="flex-1 overflow-y-auto py-2 flex flex-col items-center">
        {tools.map((section, idx) => (
          <div key={section.section} className="mb-2">
            {idx > 0 && <div className="w-10 h-px bg-slate-200 mx-auto my-3" />}
            <div className="space-y-2">
              {section.items.map((tool) =>
                tool.type === "dropdown"
                  ? renderDropdown(tool)
                  : renderButton(tool)
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 mt-auto">
        <div className="w-10 h-px bg-slate-200 mx-auto my-3" />
        <div className="relative group">
          <button className="w-14 h-14 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center rounded-xl transition-colors">
            <Settings size={22} />
          </button>
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
            <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">
              Settings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;

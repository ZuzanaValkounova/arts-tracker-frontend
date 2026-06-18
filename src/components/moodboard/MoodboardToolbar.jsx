import { useState } from "react";
import { ColorSwatch } from "../ui/ColorSwatch";

const TOOLS = [
	{ id: "select", label: "Select", icon: "🖱️" },
	{ id: "image", label: "Image", icon: "🖼️" },
	{ id: "text", label: "Text", icon: "🅣" },
	{ id: "color", label: "Color tile", icon: "🎨" },
	{ id: "draw", label: "Draw", icon: "✏️" },
];

// draw, text and color tools all need a current color to work with.
const MoodboardToolbar = ({
	activeTool,
	onToolChange,
	palette = [],
	onAddColor,
	activeColor,
	onActiveColorChange,
	onDeleteSelected,
}) => {
	const [newColor, setNewColor] = useState("#3b82f6");

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
			<div className="flex gap-1">
				{TOOLS.map((tool) => (
					<button
						key={tool.id}
						type="button"
						title={tool.label}
						onClick={() => onToolChange(tool.id)}
						className={`rounded-md px-2.5 py-1.5 text-sm ${
							activeTool === tool.id ? "bg-gray-900 text-white" : "hover:bg-gray-100"
						}`}>
						{tool.icon}
					</button>
				))}
			</div>
			<span className="h-6 w-px bg-gray-200" />
			<div className="flex items-center gap-1.5">
				{palette.map((hex) => (
					<ColorSwatch
						key={hex}
						color={hex}
						size="sm"
						selected={activeColor === hex}
						onClick={() => onActiveColorChange?.(hex)}
					/>
				))}
				<input
					type="color"
					value={newColor}
					onChange={(e) => setNewColor(e.target.value)}
					className="h-5 w-5 cursor-pointer"
				/>
				<button
					type="button"
					onClick={() => onAddColor(newColor)}
					className="text-xs text-gray-500 hover:text-gray-800">
					+ Add
				</button>
			</div>
			{onDeleteSelected && (
				<button
					type="button"
					onClick={onDeleteSelected}
					className="ml-auto rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
					Delete selected
				</button>
			)}
		</div>
	);
};

export { MoodboardToolbar };

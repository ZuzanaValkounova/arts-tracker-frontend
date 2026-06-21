import { useState } from "react";
import {
	MousePointer2,
	Image as ImageIcon,
	Type,
	Palette,
	Paintbrush,
	Plus,
	Trash2,
} from "lucide-react";

import { ColorSwatch } from "../ui/shared/ColorSwatch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TOOLS = [
	{ id: "select", label: "Select", icon: MousePointer2 },
	{ id: "image", label: "Image", icon: ImageIcon },
	{ id: "text", label: "Text", icon: Type },
	{ id: "color", label: "Color tile", icon: Palette },
	{ id: "draw", label: "Draw", icon: Paintbrush },
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
		<div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-2">
			<ToggleGroup
				type="single"
				variant="outline"
				value={activeTool}
				onValueChange={(next) => next && onToolChange(next)}>
				{TOOLS.map((tool) => (
					<ToggleGroupItem key={tool.id} value={tool.id} aria-label={tool.label} title={tool.label}>
						<tool.icon />
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<Separator orientation="vertical" className="h-6" />
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
					className="size-5 cursor-pointer rounded"
				/>
				<Button type="button" variant="ghost" size="xs" onClick={() => onAddColor(newColor)}>
					<Plus />
					Add
				</Button>
			</div>
			{onDeleteSelected && (
				<Button
					type="button"
					variant="destructive"
					size="sm"
					className="ml-auto"
					onClick={onDeleteSelected}>
					<Trash2 />
					Delete selected
				</Button>
			)}
		</div>
	);
};

export { MoodboardToolbar };

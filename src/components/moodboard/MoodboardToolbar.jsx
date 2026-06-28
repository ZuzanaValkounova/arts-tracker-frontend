import { MousePointer2, Image as ImageIcon, Type, Palette, Paintbrush, Trash2 } from "lucide-react";

import { ColorSwatch } from "../ui/shared/ColorSwatch";
import { ColorPicker } from "../ui/shared/ColorPicker";
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

const DEFAULT_PALETTE = [
	"#2b2b2b",
	"#f5f0e6",
	"#9b8fd4",
	"#86b48f",
	"#d99a6c",
	"#cf8e8e",
	"#d9b86c",
	"#7fa8c9",
];

const MoodboardToolbar = ({
	activeTool,
	onToolChange,
	palette = [],
	onAddColor,
	activeColor,
	onActiveColorChange,
	onDeleteSelected,
}) => {
	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-2">
			<ToggleGroup
				type="single"
				variant="outline"
				value={activeTool}
				onValueChange={(next) => next && onToolChange(next)}>
				{TOOLS.map((tool) => (
					<ToggleGroupItem key={tool.id} value={tool.id} aria-label={tool.label} title={tool.label}>
						<tool.icon className="size-5" />
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<Separator orientation="vertical" className="h-6" />
			<div className="flex items-center gap-1.5">
				{[...new Set([...DEFAULT_PALETTE, ...palette])].map((hex) => (
					<ColorSwatch
						key={hex}
						color={hex}
						size="sm"
						selected={activeColor === hex}
						onClick={() => onActiveColorChange?.(hex)}
					/>
				))}
				<ColorPicker
					value={activeColor}
					onChange={(color) => {
						if (!color) return;
						onActiveColorChange?.(color);
						onAddColor?.(color);
					}}
				/>
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

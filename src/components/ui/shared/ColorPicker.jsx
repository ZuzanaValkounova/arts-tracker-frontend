import { ColorSwatch } from "./ColorSwatch";
import { Button } from "@/components/ui/button";

// project accent colors
const PRESET_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
];

const ColorPicker = ({ value, onChange, presets = PRESET_COLORS }) => {
	return (
		<div className="flex items-center gap-1.5">
			{presets.map((color) => (
				<ColorSwatch
					key={color}
					color={color}
					size="md"
					selected={value === color}
					onClick={() => onChange(color)}
				/>
			))}
			<label className="relative cursor-pointer">
				<input
					type="color"
					value={value ?? "#808080"}
					onChange={(e) => onChange(e.target.value)}
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
				<span
					className="block size-6 rounded border border-dashed border-input text-center text-sm leading-5 text-muted-foreground"
					style={value && !presets.includes(value) ? { backgroundColor: value } : undefined}>
					{value && !presets.includes(value) ? "" : "+"}
				</span>
			</label>
			{value && (
				<Button type="button" variant="ghost" size="xs" onClick={() => onChange(null)}>
					Clear
				</Button>
			)}
		</div>
	);
};

export { ColorPicker };

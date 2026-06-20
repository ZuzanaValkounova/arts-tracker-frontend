import { ColorSwatch } from "./ColorSwatch";

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
					className="block h-6 w-6 rounded border border-dashed border-gray-400 text-center text-sm leading-5 text-gray-400"
					style={value && !presets.includes(value) ? { backgroundColor: value } : undefined}>
					{value && !presets.includes(value) ? "" : "+"}
				</span>
			</label>
			{value && (
				<button
					type="button"
					onClick={() => onChange(null)}
					className="text-xs text-gray-400 hover:text-gray-600">
					Clear
				</button>
			)}
		</div>
	);
};

export { ColorPicker };

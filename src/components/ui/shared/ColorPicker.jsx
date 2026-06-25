import { Check, Pipette, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors hover:bg-muted">
					<span
						className="size-5 rounded border"
						style={{
							backgroundColor: value ?? "transparent",
							backgroundImage: value
								? undefined
								: "repeating-conic-gradient(var(--muted-foreground) 0% 25%, transparent 0% 50%) 50% / 8px 8px",
						}}
					/>
					<span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
						{value ?? "Choose color"}
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-60">
				<div className="flex flex-col gap-3">
					<div className="grid grid-cols-8 gap-1.5">
						{presets.map((color) => (
							<button
								key={color}
								type="button"
								onClick={() => onChange(color)}
								className={cn(
									"flex size-6 items-center justify-center rounded-full border transition-transform hover:scale-110",
									value === color && "ring-2 ring-ring ring-offset-1",
								)}
								style={{ backgroundColor: color }}
								aria-label={color}>
								{value === color && <Check className="size-3.5 text-white" />}
							</button>
						))}
					</div>
					<div className="flex items-center gap-2">
						<label
							className="relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-input"
							title="Custom color">
							<Pipette className="size-4 text-muted-foreground" />
							<input
								type="color"
								value={value ?? "#808080"}
								onChange={(e) => onChange(e.target.value)}
								className="absolute inset-0 cursor-pointer opacity-0"
							/>
						</label>
						<Input
							value={value ?? ""}
							onChange={(e) => onChange(e.target.value || null)}
							placeholder="#hex"
							className="h-8 flex-1"
						/>
						{value && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Clear color"
								onClick={() => onChange(null)}>
								<X />
							</Button>
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export { ColorPicker };

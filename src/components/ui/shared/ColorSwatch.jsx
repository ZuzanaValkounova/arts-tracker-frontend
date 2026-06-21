import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
	sm: "size-4",
	md: "size-6",
	lg: "size-8",
};

// presentational color square; pass onClick to make it interactive (e.g. palette in the moodboard)
const ColorSwatch = ({ color, size = "md", selected = false, onClick, title }) => {
	const Tag = onClick ? "button" : "div";
	return (
		<Tag
			type={onClick ? "button" : undefined}
			onClick={onClick}
			title={title ?? color}
			className={cn(
				"shrink-0 rounded border",
				SIZE_CLASSES[size],
				selected ? "ring-2 ring-ring ring-offset-1" : "border-border",
				onClick && "cursor-pointer",
			)}
			style={{ backgroundColor: color }}
		/>
	);
};

export { ColorSwatch };

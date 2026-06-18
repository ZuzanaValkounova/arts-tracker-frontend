const SIZE_CLASSES = {
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
};

// presentational color square; pass onClick to make it interactive (e.g. palette in the moodboard)
const ColorSwatch = ({ color, size = "md", selected = false, onClick, title }) => {
	const Tag = onClick ? "button" : "div";
	return (
		<Tag
			type={onClick ? "button" : undefined}
			onClick={onClick}
			title={title ?? color}
			className={`shrink-0 rounded border ${SIZE_CLASSES[size]} ${
				selected ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-300"
			} ${onClick ? "cursor-pointer" : ""}`}
			style={{ backgroundColor: color }}
		/>
	);
};

export { ColorSwatch };

// tag: { _id, name, color }
const TagChip = ({ tag, onRemove, onClick, selected = false }) => {
	const Tag = onClick ? "button" : "span";
	return (
		<Tag
			type={onClick ? "button" : undefined}
			onClick={onClick}
			className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
				selected ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
			} ${onClick ? "cursor-pointer hover:border-gray-400" : ""}`}
		>
			<span
				className="h-2 w-2 rounded-full"
				style={{ backgroundColor: tag.color ?? "#9ca3af" }}
			/>
			{tag.name}
			{onRemove && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(tag._id);
					}}
					className="ml-0.5 text-gray-400 hover:text-gray-700"
					aria-label={`Remove tag ${tag.name}`}
				>
					×
				</button>
			)}
		</Tag>
	);
};

export { TagChip };

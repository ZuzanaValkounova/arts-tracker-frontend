import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// tag: { _id, name, color }
const TagChip = ({ tag, onRemove, onClick, selected = false }) => {
	const Tag = onClick ? "button" : "span";
	return (
		<Tag
			type={onClick ? "button" : undefined}
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
				selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background",
				onClick && "cursor-pointer hover:border-ring",
			)}>
			<span
				className="size-2 rounded-full"
				style={{ backgroundColor: tag.color ?? "var(--muted-foreground)" }}
			/>
			{tag.name}
			{onRemove && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(tag._id);
					}}
					className="ml-0.5 text-muted-foreground hover:text-foreground"
					aria-label={`Remove tag ${tag.name}`}>
					<X className="size-3" />
				</button>
			)}
		</Tag>
	);
};

export { TagChip };

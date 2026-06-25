import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
	sm: "gap-1 px-2 py-0.5 text-xs",
	md: "gap-1.5 px-2.5 py-1 text-sm",
};

// tag: { _id, name, color }
const TagChip = ({ tag, onRemove, onClick, selected = false, size = "sm" }) => {
	const color = tag.color ?? "var(--muted-foreground)";
	const Tag = onClick ? "button" : "span";
	return (
		<Tag
			type={onClick ? "button" : undefined}
			onClick={onClick}
			className={cn(
				"inline-flex items-center rounded-full border font-medium transition",
				SIZE_CLASSES[size],
				onClick && "cursor-pointer hover:brightness-95",
				selected && "ring-2 ring-ring ring-offset-1",
			)}
			style={{
				backgroundColor: `color-mix(in oklab, ${color} 22%, var(--card))`,
				borderColor: `color-mix(in oklab, ${color} 60%, transparent)`,
				color: `color-mix(in oklab, ${color} 38%, var(--foreground))`,
			}}>
			<span
				className={cn("shrink-0 rounded-full", size === "md" ? "size-2.5" : "size-2")}
				style={{ backgroundColor: color }}
			/>
			{tag.name}
			{onRemove && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(tag._id);
					}}
					className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
					aria-label={`Remove tag ${tag.name}`}>
					<X className="size-3" />
				</button>
			)}
		</Tag>
	);
};

export { TagChip };

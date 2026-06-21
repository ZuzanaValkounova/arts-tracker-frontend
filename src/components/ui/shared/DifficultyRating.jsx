import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// 1–5 flames
const DifficultyRating = ({ value = 0, onChange, readOnly = false }) => {
	return (
		<div
			className="inline-flex items-center gap-0.5"
			role={readOnly ? "img" : "radiogroup"}
			aria-label={`Difficulty ${value} of 5`}>
			{[1, 2, 3, 4, 5].map((level) => (
				<button
					key={level}
					type="button"
					disabled={readOnly}
					onClick={() => onChange?.(level === value ? null : level)}
					className={cn(
						"leading-none transition-colors",
						level <= value ? "text-orange-500" : "text-muted-foreground/30",
						!readOnly && "cursor-pointer hover:text-orange-600",
					)}
					aria-label={`Difficulty ${level} of 5`}>
					<Flame className={cn("size-5", level <= value && "fill-orange-500/80")} />
				</button>
			))}
		</div>
	);
};

export { DifficultyRating };

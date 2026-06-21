import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// 1–5
const DifficultyRating = ({ value = 0, onChange, readOnly = false }) => {
	return (
		<div className="inline-flex items-center gap-0.5" role={readOnly ? "img" : "radiogroup"}>
			{[1, 2, 3, 4, 5].map((trophy) => (
				<button
					key={trophy}
					type="button"
					disabled={readOnly}
					onClick={() => onChange?.(trophy === value ? null : trophy)}
					className={cn(
						"leading-none",
						trophy <= value ? "text-amber-400" : "text-muted-foreground/30",
						readOnly ? "cursor-default" : "cursor-pointer hover:text-amber-500",
					)}
					aria-label={`Difficulty ${trophy} of 5`}>
					<Trophy className={cn("size-4", trophy <= value && "fill-current")} />
				</button>
			))}
		</div>
	);
};

export { DifficultyRating };

import { CircleCheckBig } from "lucide-react";

import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { isOverdue } from "../../utils/tasks";
import { cn } from "@/lib/utils";

const TaskCard = ({ task, onOpen, dragging = false }) => {
	const completed = task.status === "completed";

	return (
		<div
			onClick={() => onOpen?.(task._id)}
			className={cn(
				"cursor-pointer rounded-md border bg-card p-3 shadow-sm transition-colors hover:border-ring",
				completed && "border-emerald-500/30 bg-emerald-500/10",
				dragging && "opacity-50",
			)}>
			<div className="flex items-start justify-between gap-2">
				<span className="flex items-start gap-1.5 text-sm font-medium">
					{completed && <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-emerald-400" />}
					<span className={cn(completed && "text-muted-foreground line-through")}>{task.name}</span>
				</span>
				<PriorityBadge priority={task.priority} />
			</div>
			{task.deadline && (
				<div
					className={cn(
						"mt-1 text-xs",
						isOverdue(task) ? "text-destructive" : "text-muted-foreground",
					)}>
					Due {new Date(task.deadline).toLocaleDateString()}
				</div>
			)}
		</div>
	);
};

export { TaskCard };

import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { isOverdue } from "../../utils/tasks";
import { cn } from "@/lib/utils";

const TaskCard = ({ task, onOpen, dragging = false }) => {
	return (
		<div
			onClick={() => onOpen?.(task._id)}
			className={cn(
				"cursor-pointer rounded-md border bg-card p-3 shadow-sm transition-colors hover:border-ring",
				dragging && "opacity-50",
			)}>
			<div className="flex items-start justify-between gap-2">
				<span className="text-sm font-medium">{task.name}</span>
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

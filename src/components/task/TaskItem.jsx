import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "../ui/shared/StatusBadge";
import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { Button } from "@/components/ui/button";
import { isOverdue } from "../../utils/tasks";
import { cn } from "@/lib/utils";

// one row in the list view; renders nested subtasks recursively via task.children
const TaskItem = ({ task, depth = 0, onToggleComplete, onEdit, onDelete, onAddSubtask }) => {
	const [expanded, setExpanded] = useState(true);
	const hasChildren = task.children?.length > 0;
	const completed = task.status === "completed";

	return (
		<div>
			<div
				className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
				style={{ paddingLeft: `${depth * 24 + 8}px` }}>
				<button
					type="button"
					onClick={() => setExpanded((prev) => !prev)}
					className={cn(
						"flex w-4 items-center justify-center text-muted-foreground",
						!hasChildren && "invisible",
					)}
					aria-label={expanded ? "Collapse" : "Expand"}>
					{expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
				</button>
				<input
					type="checkbox"
					checked={completed}
					onChange={() => onToggleComplete(task._id)}
					className="size-4 cursor-pointer accent-primary"
				/>
				<span className={cn("flex-1 text-sm", completed && "text-muted-foreground line-through")}>
					{task.name}
				</span>
				{task.deadline && (
					<span
						className={cn(
							"text-xs",
							isOverdue(task) ? "text-destructive" : "text-muted-foreground",
						)}>
						{new Date(task.deadline).toLocaleDateString()}
					</span>
				)}
				<PriorityBadge priority={task.priority} />
				<StatusBadge status={task.status} size="sm" />
				<div className="invisible flex gap-0.5 group-hover:visible">
					{onAddSubtask && (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="Add subtask"
							onClick={() => onAddSubtask(task)}>
							<Plus />
						</Button>
					)}
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label="Edit task"
						onClick={() => onEdit(task)}>
						<Pencil />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label="Delete task"
						onClick={() => onDelete(task)}>
						<Trash2 />
					</Button>
				</div>
			</div>
			{hasChildren && expanded && (
				<div>
					{task.children.map((child) => (
						<TaskItem
							key={child._id}
							task={child}
							depth={depth + 1}
							onToggleComplete={onToggleComplete}
							onEdit={onEdit}
							onDelete={onDelete}
							onAddSubtask={onAddSubtask}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export { TaskItem };

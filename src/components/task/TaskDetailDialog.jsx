import { Plus } from "lucide-react";

import { FormDialog } from "../ui/shared/FormDialog";
import { StatusBadge } from "../ui/shared/StatusBadge";
import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { Button } from "@/components/ui/button";
import { TaskListView } from "./TaskListView";

// target for onOpen(taskId) from the kanban/list
// subtasks: flat array of descendants (page filters tasks by parentTaskId chain)
const TaskDetailDialog = ({
	open,
	task,
	subtasks = [],
	onClose,
	onEdit,
	onDelete,
	onToggleComplete,
	onEditSubtask,
	onDeleteSubtask,
	onAddSubtask,
}) => {
	if (!task) return null;

	return (
		<FormDialog open={open} onClose={onClose} title={task.name} className="sm:max-w-2xl">
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<StatusBadge status={task.status} />
					<PriorityBadge priority={task.priority} />
					{task.deadline && (
						<span className="text-xs text-muted-foreground">
							Due {new Date(task.deadline).toLocaleDateString()}
						</span>
					)}
				</div>
				{task.description && (
					<p className="whitespace-pre-wrap text-sm text-muted-foreground">{task.description}</p>
				)}
				<div>
					<div className="mb-1 flex items-center justify-between">
						<h3 className="text-sm font-semibold">Subtasks</h3>
						{onAddSubtask && (
							<Button type="button" variant="ghost" size="sm" onClick={() => onAddSubtask(task)}>
								<Plus />
								Add subtask
							</Button>
						)}
					</div>
					<TaskListView
						tasks={subtasks}
						onToggleComplete={onToggleComplete}
						onEdit={onEditSubtask}
						onDelete={onDeleteSubtask}
						onAddSubtask={onAddSubtask}
					/>
				</div>
				<div className="flex justify-end gap-2 border-t pt-3">
					<Button type="button" variant="destructive" onClick={() => onDelete(task)}>
						Delete
					</Button>
					<Button type="button" onClick={() => onEdit(task)}>
						Edit
					</Button>
				</div>
			</div>
		</FormDialog>
	);
};

export { TaskDetailDialog };

import { Modal } from "../ui/shared/Modal";
import { StatusBadge } from "../ui/shared/StatusBadge";
import { PriorityBadge } from "../ui/shared/PriorityBadge";
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
		<Modal open={open} onClose={onClose} title={task.name} widthClass="max-w-2xl">
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<StatusBadge status={task.status} />
					<PriorityBadge priority={task.priority} />
					{task.deadline && (
						<span className="text-xs text-gray-500">
							Due {new Date(task.deadline).toLocaleDateString()}
						</span>
					)}
				</div>
				{task.description && (
					<p className="whitespace-pre-wrap text-sm text-gray-600">{task.description}</p>
				)}
				<div>
					<div className="mb-1 flex items-center justify-between">
						<h3 className="text-sm font-semibold">Subtasks</h3>
						{onAddSubtask && (
							<button
								type="button"
								onClick={() => onAddSubtask(task)}
								className="text-xs text-blue-600 hover:underline">
								+ Add subtask
							</button>
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
				<div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
					<button
						type="button"
						onClick={() => onDelete(task)}
						className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
						Delete
					</button>
					<button
						type="button"
						onClick={() => onEdit(task)}
						className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
						Edit
					</button>
				</div>
			</div>
		</Modal>
	);
};

export { TaskDetailDialog };

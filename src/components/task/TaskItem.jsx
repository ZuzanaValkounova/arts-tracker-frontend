import { useState } from "react";

import { StatusBadge } from "../ui/StatusBadge";
import { PriorityBadge } from "../ui/PriorityBadge";
import { isOverdue } from "../../utils/tasks";

// one row in the list view; renders nested subtasks recursively via task.children
const TaskItem = ({ task, depth = 0, onToggleComplete, onEdit, onDelete, onAddSubtask }) => {
	const [expanded, setExpanded] = useState(true);
	const hasChildren = task.children?.length > 0;
	const completed = task.status === "completed";

	return (
		<div>
			<div
				className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
				style={{ paddingLeft: `${depth * 24 + 8}px` }}>
				<button
					type="button"
					onClick={() => setExpanded((prev) => !prev)}
					className={`w-4 text-xs text-gray-400 ${hasChildren ? "" : "invisible"}`}
					aria-label={expanded ? "Collapse" : "Expand"}>
					{expanded ? "▾" : "▸"}
				</button>
				<input
					type="checkbox"
					checked={completed}
					onChange={() => onToggleComplete(task._id)}
					className="h-4 w-4 cursor-pointer"
				/>
				<span className={`flex-1 text-sm ${completed ? "text-gray-400 line-through" : ""}`}>
					{task.name}
				</span>
				{task.deadline && (
					<span className={`text-xs ${isOverdue(task) ? "text-red-600" : "text-gray-400"}`}>
						{new Date(task.deadline).toLocaleDateString()}
					</span>
				)}
				<PriorityBadge priority={task.priority} />
				<StatusBadge status={task.status} size="sm" />
				<div className="invisible flex gap-1 group-hover:visible">
					{onAddSubtask && (
						<button
							type="button"
							onClick={() => onAddSubtask(task)}
							className="text-xs text-gray-400 hover:text-gray-700"
							title="Add subtask">
							＋
						</button>
					)}
					<button
						type="button"
						onClick={() => onEdit(task)}
						className="text-xs text-gray-400 hover:text-gray-700">
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(task)}
						className="text-xs text-red-400 hover:text-red-600">
						Delete
					</button>
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

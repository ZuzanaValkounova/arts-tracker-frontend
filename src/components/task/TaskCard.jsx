import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { isOverdue } from "../../utils/tasks";

const TaskCard = ({ task, onOpen, dragging = false }) => {
	return (
		<div
			onClick={() => onOpen?.(task._id)}
			className={`cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 ${
				dragging ? "opacity-50" : ""
			}`}>
			<div className="flex items-start justify-between gap-2">
				<span className="text-sm font-medium">{task.name}</span>
				<PriorityBadge priority={task.priority} />
			</div>
			{task.deadline && (
				<div className={`mt-1 text-xs ${isOverdue(task) ? "text-red-600" : "text-gray-500"}`}>
					Due {new Date(task.deadline).toLocaleDateString()}
				</div>
			)}
		</div>
	);
};

export { TaskCard };

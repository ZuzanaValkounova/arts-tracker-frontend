import { TaskItem } from "./TaskItem";
import { EmptyState } from "../ui/shared/EmptyState";
import { buildTaskTree } from "../../utils/tasks";

// list view incl. subtasks; expects flat task array
const TaskListView = ({ tasks, onToggleComplete, onEdit, onDelete, onAddSubtask }) => {
	const tree = buildTaskTree(tasks);

	if (tree.length === 0) {
		return <EmptyState message="No tasks yet." />;
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-2">
			{tree.map((task) => (
				<TaskItem
					key={task._id}
					task={task}
					onToggleComplete={onToggleComplete}
					onEdit={onEdit}
					onDelete={onDelete}
					onAddSubtask={onAddSubtask}
				/>
			))}
		</div>
	);
};

export { TaskListView };

import { DndContext, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";

import { KanbanColumn } from "./KanbanColumn";
import { TASK_STATUSES } from "../../utils/constants";
import { midpointOrder } from "../../utils/tasks";

// kanban over top-level tasks (pass tasks already filtered to parentTaskId === null).
// - drop on another column → onStatusChange(taskId, status)
// - drop on a card in the same column → onReorder(taskId, order); order=null means the
//   sibling gap is exhausted → the page should PATCH /tasks/renumber and refetch
const TaskKanbanBoard = ({ tasks, onStatusChange, onReorder, onOpen }) => {
	// distance constraint keeps plain clicks working (onOpen) next to drag listeners
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const tasksByStatus = (status) =>
		tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return;

		const task = tasks.find((t) => t._id === active.id);
		if (!task) return;

		// dropped over a column → move to that status (appended to the end by the backend order)
		if (over.data.current?.type === "column") {
			const newStatus = over.data.current.status;
			if (newStatus !== task.status) onStatusChange(task._id, newStatus);
			return;
		}

		// dropped over another card
		const overTask = tasks.find((t) => t._id === over.id);
		if (!overTask) return;

		if (overTask.status !== task.status) {
			// cross-column drop onto a card -> change status
			onStatusChange(task._id, overTask.status);
			return;
		}

		// reorder within the same column: place the task at the position of overTask
		const siblings = tasksByStatus(task.status).filter((t) => t._id !== task._id);
		const overIndex = siblings.findIndex((t) => t._id === overTask._id);
		const movingDown = task.order < overTask.order;
		const prev = movingDown ? siblings[overIndex] : siblings[overIndex - 1];
		const next = movingDown ? siblings[overIndex + 1] : siblings[overIndex];
		onReorder(task._id, midpointOrder(prev?.order ?? null, next?.order ?? null));
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className="flex gap-3 overflow-x-auto pb-2">
				{TASK_STATUSES.map((status) => (
					<KanbanColumn
						key={status}
						status={status}
						tasks={tasksByStatus(status)}
						onOpenTask={onOpen}
					/>
				))}
			</div>
		</DndContext>
	);
};

export { TaskKanbanBoard };

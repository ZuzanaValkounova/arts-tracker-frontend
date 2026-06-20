import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import { KanbanColumn } from "./KanbanColumn";
import { TASK_STATUSES } from "../../utils/constants";
import { midpointOrder } from "../../utils/tasks";

// group top-level tasks into ordered columns by status: { planned: [task…], inProgress: [task…], … }
const buildColumns = (tasks) => {
	const columns = Object.fromEntries(TASK_STATUSES.map((status) => [status, []]));
	tasks.forEach((task) => columns[task.status]?.push(task));
	TASK_STATUSES.forEach((status) => columns[status].sort((a, b) => a.order - b.order));
	return columns;
};

// kanban over top-level tasks
// onMove(taskId, { status?, order? }) commits a drop
// onRenumber() when the sibling order gap is exhausted
const TaskKanbanBoard = ({ tasks, onMove, onRenumber, onOpen }) => {
	const [override, setOverride] = useState(null); // { tasksRef, columns }
	const columns = override?.tasksRef === tasks ? override.columns : buildColumns(tasks);

	const handleDragEnd = ({ source, destination, draggableId }) => {
		if (!destination) return; // dropped outside any column
		if (source.droppableId === destination.droppableId && source.index === destination.index)
			return;

		const original = tasks.find((t) => t._id === draggableId);
		if (!original) return;

		// optimistically reorder a local copy
		const next = Object.fromEntries(TASK_STATUSES.map((s) => [s, [...columns[s]]]));
		const [moved] = next[source.droppableId].splice(source.index, 1);
		if (!moved) return;
		next[destination.droppableId].splice(destination.index, 0, {
			...moved,
			status: destination.droppableId,
		});
		setOverride({ tasksRef: tasks, columns: next });

		// new order = midpoint between the dropped card's new neighbours
		const list = next[destination.droppableId];
		const order = midpointOrder(
			list[destination.index - 1]?.order ?? null,
			list[destination.index + 1]?.order ?? null,
		);
		const statusChanged = source.droppableId !== destination.droppableId;

		if (order === null) {
			// gap between neighbours exhausted → renumber (and still move the column if it changed)
			if (statusChanged) onMove(draggableId, { status: destination.droppableId });
			onRenumber();
			return;
		}
		onMove(draggableId, statusChanged ? { status: destination.droppableId, order } : { order });
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="flex gap-3 overflow-x-auto pb-2">
				{TASK_STATUSES.map((status) => (
					<KanbanColumn key={status} status={status} tasks={columns[status]} onOpen={onOpen} />
				))}
			</div>
		</DragDropContext>
	);
};

export { TaskKanbanBoard };

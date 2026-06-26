import { useState, useCallback } from "react";
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
// onMove(taskId, { status?, order? }) commits a drop optimistically in TasksTab
// onRenumber() when the sibling order gap is exhausted
const TaskKanbanBoard = ({ tasks, onMove, onRenumber, onOpen }) => {
	// tempTasks holds the locally-reordered list synchronously after a drop so the board
	// doesn't flicker back to old positions while the react-query optimistic update propagates
	const [tempTasks, setTempTasks] = useState(null);

	const displayTasks = tempTasks ?? tasks;
	const columns = buildColumns(displayTasks);

	const handleDragEnd = useCallback(
		async ({ source, destination, draggableId }) => {
			if (!destination) return;
			if (source.droppableId === destination.droppableId && source.index === destination.index)
				return;

			const working = Object.fromEntries(TASK_STATUSES.map((s) => [s, [...columns[s]]]));
			const [moved] = working[source.droppableId].splice(source.index, 1);
			if (!moved) return;
			working[destination.droppableId].splice(destination.index, 0, moved);

			const list = working[destination.droppableId];
			const order = midpointOrder(
				list[destination.index - 1]?.order ?? null,
				list[destination.index + 1]?.order ?? null,
			);
			const statusChanged = source.droppableId !== destination.droppableId;

			// build the optimistic task list and show it immediately before the mutation fires
			const reordered = displayTasks.map((task) => {
				if (task._id !== draggableId) return task;
				return {
					...task,
					...(statusChanged ? { status: destination.droppableId } : {}),
					...(order !== null ? { order } : {}),
				};
			});
			setTempTasks(reordered);

			try {
				if (order === null) {
					if (statusChanged) await onMove(draggableId, { status: destination.droppableId });
					onRenumber();
				} else {
					await onMove(
						draggableId,
						statusChanged ? { status: destination.droppableId, order } : { order },
					);
				}
			} finally {
				setTempTasks(null);
			}
		},
		[columns, displayTasks, onMove, onRenumber],
	);

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

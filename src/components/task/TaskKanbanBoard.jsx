import { useState, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import { KanbanColumn } from "./KanbanColumn";
import { TASK_STATUSES } from "../../utils/constants";
import { midpointOrder, STEP } from "../../utils/tasks";

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
			const before = list[destination.index - 1];
			const after = list[destination.index + 1];
			const statusChanged = source.droppableId !== destination.droppableId;
			const order = midpointOrder(before?.order ?? null, after?.order ?? null);

			// optimistic display order
			const displayOrder =
				order ??
				(before && after
					? (before.order + after.order) / 2
					: before
						? before.order + 0.5
						: after
							? after.order - 0.5
							: STEP);
			setTempTasks(
				displayTasks.map((task) =>
					task._id === draggableId
						? {
								...task,
								...(statusChanged ? { status: destination.droppableId } : {}),
								order: displayOrder,
							}
						: task,
				),
			);

			try {
				let finalOrder = order;
				if (finalOrder === null) {
					// gap exhausted: renumber all top-level tasks then place the card between its neighbours' predicted orders
					await onRenumber();
					const sorted = [...displayTasks].sort((a, b) => a.order - b.order);
					const predicted = (task) =>
						task ? (sorted.findIndex((t) => t._id === task._id) + 1) * STEP : null;
					finalOrder = midpointOrder(predicted(before), predicted(after));
				}
				await onMove(
					draggableId,
					statusChanged
						? { status: destination.droppableId, order: finalOrder }
						: { order: finalOrder },
				);
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

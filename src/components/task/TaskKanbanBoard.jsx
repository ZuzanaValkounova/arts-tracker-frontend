import { useState } from "react";
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
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
// - drop on another column → onStatusChange(taskId, status)
// - drop on a card in the same column → onReorder(taskId, order); order=null means the
//   sibling gap is exhausted → the page should PATCH /tasks/renumber and refetch
const TaskKanbanBoard = ({ tasks, onMove, onRenumber, onOpen }) => {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const [activeId, setActiveId] = useState(null);
	const [override, setOverride] = useState(null); // { tasksRef, columns }

	const columns = override && override.tasksRef === tasks ? override.columns : buildColumns(tasks);
	const activeTask = activeId
		? TASK_STATUSES.flatMap((status) => columns[status]).find((t) => t._id === activeId)
		: null;

	const containerOf = (id) =>
		TASK_STATUSES.includes(id)
			? id
			: TASK_STATUSES.find((status) => columns[status].some((t) => t._id === id));

	const handleDragStart = ({ active }) => {
		setActiveId(active.id);
		setOverride({ tasksRef: tasks, columns: buildColumns(tasks) });
	};

	// move the card between columns live, the target column makes room while hovering
	const handleDragOver = ({ active, over }) => {
		if (!over) return;
		setOverride((prev) => {
			const cols = prev && prev.tasksRef === tasks ? prev.columns : buildColumns(tasks);
			const from = TASK_STATUSES.find((s) => cols[s].some((t) => t._id === active.id));
			const to = TASK_STATUSES.includes(over.id)
				? over.id
				: TASK_STATUSES.find((s) => cols[s].some((t) => t._id === over.id));
			if (!from || !to || from === to) return prev;

			const moving = cols[from].find((t) => t._id === active.id);
			if (!moving) return prev;
			const overItems = cols[to];
			const insertAt = TASK_STATUSES.includes(over.id)
				? overItems.length
				: overItems.findIndex((t) => t._id === over.id);

			return {
				tasksRef: tasks,
				columns: {
					...cols,
					[from]: cols[from].filter((t) => t._id !== active.id),
					[to]: [
						...overItems.slice(0, insertAt),
						{ ...moving, status: to },
						...overItems.slice(insertAt),
					],
				},
			};
		});
	};

	const handleDragEnd = ({ active, over }) => {
		setActiveId(null);
		if (!over) return;

		const original = tasks.find((t) => t._id === active.id);
		const container = containerOf(active.id);
		if (!original || !container) return;

		const statusChanged = original.status !== container;
		if (!statusChanged && over.id === active.id) return;

		let column = columns[container];

		// reorder within the (possibly new) column to the slot of the card dropped on
		if (over.id !== active.id && !TASK_STATUSES.includes(over.id)) {
			const fromIdx = column.findIndex((t) => t._id === active.id);
			const toIdx = column.findIndex((t) => t._id === over.id);
			if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
				column = arrayMove(column, fromIdx, toIdx);
				setOverride({ tasksRef: tasks, columns: { ...columns, [container]: column } });
			}
		}

		const index = column.findIndex((t) => t._id === active.id);
		const order = midpointOrder(column[index - 1]?.order ?? null, column[index + 1]?.order ?? null);

		if (order === null) {
			// gap between neighbours exhausted → renumber (and still move the column if it changed)
			if (statusChanged) onMove(active.id, { status: container });
			onRenumber();
			return;
		}
		if (!statusChanged && order === original.order) return; // dropped back where it started

		onMove(active.id, statusChanged ? { status: container, order } : { order });
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={() => setActiveId(null)}>
			<div className="flex gap-3 overflow-x-auto pb-2">
				{TASK_STATUSES.map((status) => (
					<KanbanColumn key={status} status={status} tasks={columns[status]} onOpenTask={onOpen} />
				))}
			</div>
			<DragOverlay dropAnimation={{ duration: 150, easing: "ease-out" }}>
				{activeTask ? (
					<div className="w-60 rotate-2 cursor-grabbing">
						<TaskCard task={activeTask} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};

export { TaskKanbanBoard };

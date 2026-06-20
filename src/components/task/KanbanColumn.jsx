import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { SortableTaskCard } from "./SortableTaskCard";
import { STATUS_META } from "../../utils/constants";

const KanbanColumn = ({ status, title, tasks, onOpenTask }) => {
	const { setNodeRef, isOver } = useDroppable({
		id: status,
		data: { type: "column", status },
	});

	return (
		<div className="flex w-64 shrink-0 flex-col rounded-lg bg-gray-100">
			<div className="flex items-center justify-between px-3 py-2">
				<span
					className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_META[status].className}`}>
					{title ?? STATUS_META[status].label}
				</span>
				<span className="text-xs text-gray-400">{tasks.length}</span>
			</div>
			<SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
				<div
					ref={setNodeRef}
					className={`flex min-h-24 flex-1 flex-col gap-2 p-2 ${isOver ? "bg-blue-50" : ""}`}>
					{tasks.map((task) => (
						<SortableTaskCard key={task._id} task={task} onOpen={onOpenTask} />
					))}
				</div>
			</SortableContext>
		</div>
	);
};

export { KanbanColumn };

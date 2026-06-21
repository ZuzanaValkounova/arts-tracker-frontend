import { Droppable } from "@hello-pangea/dnd";

import { SortableTaskCard } from "./SortableTaskCard";
import { STATUS_META } from "../../utils/constants";

const KanbanColumn = ({ status, tasks, onOpen }) => {
	return (
		<div className="flex w-64 shrink-0 flex-col rounded-lg bg-muted/50">
			<div className="flex items-center justify-between px-3 py-2">
				<span
					className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_META[status].className}`}>
					{STATUS_META[status].label}
				</span>
				<span className="text-xs text-muted-foreground">{tasks.length}</span>
			</div>
			<Droppable droppableId={status}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`flex min-h-24 flex-1 flex-col gap-2 p-2 ${
							snapshot.isDraggingOver ? "bg-accent" : ""
						}`}>
						{tasks.map((task, index) => (
							<SortableTaskCard key={task._id} task={task} index={index} onOpen={onOpen} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export { KanbanColumn };

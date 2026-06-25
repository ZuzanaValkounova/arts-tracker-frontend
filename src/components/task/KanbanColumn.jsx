import { Droppable } from "@hello-pangea/dnd";
import { CircleCheckBig } from "lucide-react";

import { SortableTaskCard } from "./SortableTaskCard";
import { STATUS_META } from "../../utils/constants";
import { cn } from "@/lib/utils";

const KanbanColumn = ({ status, tasks, onOpen }) => {
	const isDone = status === "completed";

	return (
		<div
			className={cn(
				"flex min-w-60 flex-1 flex-col rounded-lg",
				isDone ? "bg-green-50/70 ring-1 ring-green-200" : "bg-muted/50",
			)}>
			<div className="flex items-center justify-between px-3 py-2">
				<span
					className={cn(
						"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
						STATUS_META[status].className,
					)}>
					{isDone && <CircleCheckBig className="size-3.5" />}
					{STATUS_META[status].label}
				</span>
				<span className="text-xs text-muted-foreground">{tasks.length}</span>
			</div>
			<Droppable droppableId={status}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={cn(
							"flex min-h-24 flex-1 flex-col gap-2 p-2",
							snapshot.isDraggingOver && "bg-accent",
						)}>
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

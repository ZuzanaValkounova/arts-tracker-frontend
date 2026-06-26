import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CircleCheckBig } from "lucide-react";

import { ProjectCard } from "./ProjectCard";
import { PROJECT_STATUSES, STATUS_META } from "../../utils/constants";
import { cn } from "@/lib/utils";

const ProjectKanbanBoard = ({ projects, onMove, onOpen }) => {
	const [tempProjects, setTempProjects] = useState(null);

	const displayProjects = tempProjects ?? projects;
	const columns = Object.fromEntries(PROJECT_STATUSES.map((status) => [status, []]));
	displayProjects.forEach((project) => columns[project.status]?.push(project));

	const handleDragEnd = useCallback(
		async ({ source, destination, draggableId }) => {
			if (!destination) return;
			if (source.droppableId === destination.droppableId) return;

			// apply the status change locally before the mutation fires
			setTempProjects(
				displayProjects.map((p) =>
					p._id === draggableId ? { ...p, status: destination.droppableId } : p,
				),
			);

			try {
				await onMove(draggableId, destination.droppableId);
			} finally {
				setTempProjects(null);
			}
		},
		[displayProjects, onMove],
	);

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="flex gap-3 overflow-x-auto pb-2">
				{PROJECT_STATUSES.map((status) => {
					const isDone = status === "completed";
					return (
						<div
							key={status}
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
								<span className="text-xs text-muted-foreground">{columns[status].length}</span>
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
										{columns[status].map((project, index) => (
											<Draggable key={project._id} draggableId={project._id} index={index}>
												{(prov, snap) => (
													<div
														ref={prov.innerRef}
														{...prov.draggableProps}
														{...prov.dragHandleProps}
														style={{
															...prov.draggableProps.style,
															opacity: snap.isDragging ? 0.85 : 1,
														}}>
														<ProjectCard project={project} onOpen={() => onOpen(project._id)} />
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
};

export { ProjectKanbanBoard };

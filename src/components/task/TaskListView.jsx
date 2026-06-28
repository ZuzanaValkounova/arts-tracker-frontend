import { useMemo, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
	useReactTable,
	getCoreRowModel,
	getExpandedRowModel,
	flexRender,
	createColumnHelper,
} from "@tanstack/react-table";

import { StatusBadge } from "../ui/shared/StatusBadge";
import { PriorityBadge } from "../ui/shared/PriorityBadge";
import { EmptyState } from "../ui/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buildTaskTree, isOverdue, midpointOrder, STEP } from "../../utils/tasks";
import { STATUS_META, PRIORITY_META } from "../../utils/constants";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper();

const sameParent = (a, b) => String(a.parentTaskId ?? null) === String(b.parentTaskId ?? null);

// list view incl. subtasks; expects a flat task array
// onRenumber(parentTaskId) is called when the order gap is exhausted.
const TaskListView = ({
	tasks,
	onToggleComplete,
	onEdit,
	onDelete,
	onAddSubtask,
	onReorder,
	onRenumber,
}) => {
	const enableDnd = Boolean(onReorder);

	// tempTasks holds locally reordered list synchronously after a drop
	const [tempTasks, setTempTasks] = useState(null);
	const displayTasks = tempTasks ?? tasks;
	const data = useMemo(() => buildTaskTree(displayTasks), [displayTasks]);

	const [colWidths, setColWidths] = useState(null);
	const rowRefs = useRef(new Map());

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "complete",
				header: "",
				cell: ({ row }) => (
					<div style={{ paddingLeft: `${row.depth * 20}px` }}>
						<input
							type="checkbox"
							checked={row.original.status === "completed"}
							onChange={() => onToggleComplete(row.original._id)}
							className="size-4 cursor-pointer accent-primary"
							aria-label="Toggle complete"
						/>
					</div>
				),
			}),
			columnHelper.accessor("name", {
				header: "Name",
				cell: ({ row, getValue }) => {
					const completed = row.original.status === "completed";
					return (
						<div className="flex items-center gap-1" style={{ paddingLeft: `${row.depth * 20}px` }}>
							{row.getCanExpand() ? (
								<button
									type="button"
									onClick={row.getToggleExpandedHandler()}
									className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
									aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}>
									{row.getIsExpanded() ? (
										<ChevronDown className="size-4" />
									) : (
										<ChevronRight className="size-4" />
									)}
								</button>
							) : (
								<span className="inline-block w-5" />
							)}
							<span className={cn("text-sm", completed && "text-muted-foreground line-through")}>
								{getValue()}
							</span>
						</div>
					);
				},
			}),
			columnHelper.accessor("priority", {
				header: "Priority",
				cell: ({ getValue }) => (
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex">
								<PriorityBadge priority={getValue()} />
							</span>
						</TooltipTrigger>
						<TooltipContent>Priority: {PRIORITY_META[getValue()]?.label ?? "—"}</TooltipContent>
					</Tooltip>
				),
			}),
			columnHelper.accessor("status", {
				header: "Status",
				cell: ({ getValue }) => (
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex">
								<StatusBadge status={getValue()} size="sm" />
							</span>
						</TooltipTrigger>
						<TooltipContent>Status: {STATUS_META[getValue()]?.label ?? "—"}</TooltipContent>
					</Tooltip>
				),
			}),
			columnHelper.accessor("deadline", {
				header: "Deadline",
				cell: ({ row, getValue }) =>
					getValue() ? (
						<span
							className={cn(
								"text-xs",
								isOverdue(row.original) ? "text-destructive" : "text-muted-foreground",
							)}>
							{new Date(getValue()).toLocaleDateString()}
						</span>
					) : (
						<span className="text-xs text-muted-foreground/50">—</span>
					),
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<div className="flex justify-end gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100">
						{onAddSubtask && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Add subtask"
								onClick={() => onAddSubtask(row.original)}>
								<Plus />
							</Button>
						)}
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Edit task"
							onClick={() => onEdit(row.original)}>
							<Pencil />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Delete task"
							className="text-destructive hover:text-destructive"
							onClick={() => onDelete(row.original)}>
							<Trash2 />
						</Button>
					</div>
				),
			}),
		],
		[onToggleComplete, onEdit, onDelete, onAddSubtask],
	);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		getSubRows: (row) => row.children,
		getRowId: (row) => row._id,
		initialState: { expanded: true },
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	});

	const rows = table.getRowModel().rows;

	// capture the dragged row's cell widths before the drag starts
	const handleBeforeDragStart = (start) => {
		const rowEl = rowRefs.current.get(start.draggableId);
		if (rowEl) {
			setColWidths(Array.from(rowEl.children).map((cell) => cell.getBoundingClientRect().width));
		}
	};

	const handleDragEnd = async (result) => {
		setColWidths(null);
		const { source, destination, draggableId } = result;
		if (!destination || destination.index === source.index) return;

		const moved = displayTasks.find((task) => task._id === draggableId);
		if (!moved) return;

		// reorder the flat visible list, then read the moved task's nearest siblings to find its new integer order
		const reordered = rows.map((row) => row.original);
		const [removed] = reordered.splice(source.index, 1);
		reordered.splice(destination.index, 0, removed);

		let before = null;
		let after = null;
		for (let i = destination.index - 1; i >= 0; i--) {
			if (sameParent(reordered[i], moved)) {
				before = reordered[i];
				break;
			}
		}
		for (let i = destination.index + 1; i < reordered.length; i++) {
			if (sameParent(reordered[i], moved)) {
				after = reordered[i];
				break;
			}
		}

		const order = midpointOrder(before?.order ?? null, after?.order ?? null);
		if (order !== null) {
			// normal case: set the moved task's new order
			setTempTasks(
				displayTasks.map((task) => (task._id === moved._id ? { ...task, order } : task)),
			);
			try {
				await onReorder(moved._id, { order });
			} finally {
				setTempTasks(null);
			}
			return;
		}

		// gap between siblings exhausted: show the desired order immediately, renumber this parent's
		// children, then place the moved task between its neighbours' predicted new orders
		const desiredSiblings = reordered.filter((task) => sameParent(task, moved));
		const tempOrderById = new Map(
			desiredSiblings.map((task, index) => [task._id, (index + 1) * STEP]),
		);
		setTempTasks(
			displayTasks.map((task) =>
				tempOrderById.has(task._id) ? { ...task, order: tempOrderById.get(task._id) } : task,
			),
		);
		try {
			await onRenumber?.(moved.parentTaskId ?? null);
			// renumber respaces siblings to STEP, 2*STEP, … by their current order
			const currentSorted = displayTasks
				.filter((task) => sameParent(task, moved))
				.sort((a, b) => a.order - b.order);
			const predictedOrder = (task) =>
				task ? (currentSorted.findIndex((t) => t._id === task._id) + 1) * STEP : null;
			const finalOrder = midpointOrder(predictedOrder(before), predictedOrder(after));
			await onReorder(moved._id, { order: finalOrder });
		} finally {
			setTempTasks(null);
		}
	};

	if (data.length === 0) {
		return <EmptyState message="No tasks yet." />;
	}

	const header = (
		<TableHeader>
			{table.getHeaderGroups().map((hg) => (
				<TableRow key={hg.id}>
					{enableDnd && <TableHead className="w-8" />}
					{hg.headers.map((head) => (
						<TableHead
							key={head.id}
							className={cn(
								head.column.id === "name" && "w-full",
								head.column.id === "actions" && "text-right",
							)}>
							{head.isPlaceholder
								? null
								: flexRender(head.column.columnDef.header, head.getContext())}
						</TableHead>
					))}
				</TableRow>
			))}
		</TableHeader>
	);

	// real columns start after the optional drag-handle column when reading captured widths
	const cellWidth = (index) => (colWidths ? colWidths[index + (enableDnd ? 1 : 0)] : undefined);

	const renderCells = (row) =>
		row.getVisibleCells().map((cell, index) => (
			<TableCell
				key={cell.id}
				className={cn(cell.column.id === "actions" && "text-right")}
				style={{ width: cellWidth(index) }}>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</TableCell>
		));

	if (!enableDnd) {
		return (
			<div className="overflow-hidden rounded-lg border bg-card">
				<Table>
					{header}
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id} className="group/row">
								{renderCells(row)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			<DragDropContext onBeforeDragStart={handleBeforeDragStart} onDragEnd={handleDragEnd}>
				<Table>
					{header}
					<Droppable droppableId="task-list">
						{(provided) => (
							<TableBody ref={provided.innerRef} {...provided.droppableProps}>
								{rows.map((row, index) => (
									<Draggable key={row.id} draggableId={row.id} index={index}>
										{(prov, snapshot) => (
											<TableRow
												ref={(el) => {
													prov.innerRef(el);
													if (el) rowRefs.current.set(row.id, el);
													else rowRefs.current.delete(row.id);
												}}
												{...prov.draggableProps}
												className={cn("group/row", snapshot.isDragging && "bg-muted shadow-sm")}>
												<TableCell
													className="pr-0"
													style={{ width: colWidths ? colWidths[0] : undefined }}>
													<span
														{...prov.dragHandleProps}
														aria-label="Drag to reorder"
														className="flex w-4 cursor-grab items-center text-muted-foreground/40 hover:text-foreground active:cursor-grabbing">
														<GripVertical className="size-4" />
													</span>
												</TableCell>
												{renderCells(row)}
											</TableRow>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</TableBody>
						)}
					</Droppable>
				</Table>
			</DragDropContext>
		</div>
	);
};

export { TaskListView };

import { useMemo } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
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
import { buildTaskTree, isOverdue } from "../../utils/tasks";
import { STATUS_META, PRIORITY_META } from "../../utils/constants";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper();

// list view incl. subtasks; expects a flat task array (built into a tree for the table)
const TaskListView = ({ tasks, onToggleComplete, onEdit, onDelete, onAddSubtask }) => {
	const data = useMemo(() => buildTaskTree(tasks), [tasks]);

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

	const table = useReactTable({
		data,
		columns,
		getSubRows: (row) => row.children,
		getRowId: (row) => row._id,
		initialState: { expanded: true },
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	});

	if (data.length === 0) {
		return <EmptyState message="No tasks yet." />;
	}

	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id}>
							{hg.headers.map((header) => (
								<TableHead
									key={header.id}
									className={cn(
										header.column.id === "name" && "w-full",
										header.column.id === "actions" && "text-right",
									)}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} className="group/row">
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cn(cell.column.id === "actions" && "text-right")}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export { TaskListView };

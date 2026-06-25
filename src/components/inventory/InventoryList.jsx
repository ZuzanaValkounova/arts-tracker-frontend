import { useMemo, useState } from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Pencil,
	Trash2,
	ExternalLink,
	ImageOff,
} from "lucide-react";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	createColumnHelper,
} from "@tanstack/react-table";

import { EmptyState } from "../ui/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper();

const SortButton = ({ column, children }) => {
	const sorted = column.getIsSorted();
	return (
		<button
			type="button"
			onClick={column.getToggleSortingHandler()}
			className="inline-flex items-center gap-1 hover:text-foreground">
			{children}
			{sorted === "asc" ? (
				<ArrowUp className="size-3.5" />
			) : sorted === "desc" ? (
				<ArrowDown className="size-3.5" />
			) : (
				<ArrowUpDown className="size-3.5 opacity-50" />
			)}
		</button>
	);
};

const InventoryList = ({ items, onEdit, onDelete }) => {
	const [sorting, setSorting] = useState([]);

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "thumb",
				header: "",
				cell: ({ row }) =>
					row.original.image?.url ? (
						<img
							src={row.original.image.url}
							alt={row.original.name}
							className="size-10 rounded object-cover"
						/>
					) : (
						<div className="flex size-10 items-center justify-center rounded bg-muted text-muted-foreground">
							<ImageOff className="size-4" />
						</div>
					),
			}),
			columnHelper.accessor("name", {
				header: ({ column }) => <SortButton column={column}>Name</SortButton>,
				cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
			}),
			columnHelper.accessor("type", {
				header: ({ column }) => <SortButton column={column}>Type</SortButton>,
				cell: ({ getValue }) => (
					<span className="text-muted-foreground">
						{getValue() === "tool" ? "🔧 Tool" : "🧵 Consumable"}
					</span>
				),
			}),
			columnHelper.accessor("status", {
				header: ({ column }) => <SortButton column={column}>Status</SortButton>,
				cell: ({ getValue }) => (
					<Badge
						className={cn(
							"rounded-full",
							getValue() === "owned"
								? "bg-green-100 text-green-700"
								: "bg-purple-100 text-purple-700",
						)}>
						{getValue() === "owned" ? "Owned" : "Wishlist"}
					</Badge>
				),
			}),
			columnHelper.accessor("quantity", {
				header: ({ column }) => <SortButton column={column}>Qty</SortButton>,
				cell: ({ getValue }) => <span className="tabular-nums">×{getValue()}</span>,
			}),
			columnHelper.accessor("price", {
				header: ({ column }) => <SortButton column={column}>Price</SortButton>,
				cell: ({ row, getValue }) =>
					getValue() != null ? (
						<span className="tabular-nums">
							{getValue()} {row.original.currency}
						</span>
					) : (
						<span className="text-muted-foreground/50">—</span>
					),
			}),
			columnHelper.display({
				id: "source",
				header: "Source",
				cell: ({ row }) =>
					row.original.source ? (
						<a
							href={row.original.source}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 text-primary hover:underline">
							<ExternalLink className="size-3.5" /> link
						</a>
					) : (
						<span className="text-muted-foreground/50">—</span>
					),
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<div className="flex justify-end gap-0.5">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Edit item"
							onClick={() => onEdit(row.original)}>
							<Pencil />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Delete item"
							className="text-destructive hover:text-destructive"
							onClick={() => onDelete(row.original)}>
							<Trash2 />
						</Button>
					</div>
				),
			}),
		],
		[onEdit, onDelete],
	);

	const table = useReactTable({
		data: items,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getRowId: (row) => row._id,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	if (items.length === 0) {
		return <EmptyState message="No inventory items match the filters." />;
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
									className={cn(header.column.id === "actions" && "text-right")}>
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
						<TableRow key={row.id}>
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

export { InventoryList };

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { InventoryList } from "../components/inventory/InventoryList";
import { InventoryFilters } from "../components/inventory/InventoryFilters";
import { InventoryForm } from "../components/inventory/InventoryForm";
import { Modal } from "../components/ui/shared/Modal";
import { ConfirmDialog } from "../components/ui/shared/ConfirmDialog";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";

import {
	getInventoryItems,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
} from "../api/inventory";
import { getCategories } from "../api/categories";
import { useAuth } from "../contexts/AuthContext";
import { useUrlFilters } from "../hooks/useUrlFilters";

const InventoryPage = () => {
	const [token] = useAuth();
	const queryClient = useQueryClient();

	const { get, set: setFilters } = useUrlFilters();
	const filters = {
		search: get("search"),
		status: get("status"),
		categoryId: get("categoryId"),
	};

	const [formOpen, setFormOpen] = useState(false);
	const [editedItem, setEditedItem] = useState(null);
	const [itemToDelete, setItemToDelete] = useState(null);

	const itemsQuery = useQuery({
		queryKey: ["inventory", filters],
		queryFn: () => getInventoryItems(token, filters),
	});
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(token),
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["inventory"] });

	const saveMutation = useMutation({
		mutationFn: (values) =>
			editedItem
				? updateInventoryItem(token, editedItem._id, values)
				: createInventoryItem(token, values),
		onSuccess: () => {
			invalidate();
			closeForm();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (itemId) => deleteInventoryItem(token, itemId),
		onSuccess: invalidate,
	});

	const closeForm = () => {
		setFormOpen(false);
		setEditedItem(null);
	};

	if (itemsQuery.isLoading) return <LoadingState />;
	if (itemsQuery.isError)
		return <ErrorState message={itemsQuery.error.message} onRetry={itemsQuery.refetch} />;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">Inventory</h1>
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
					+ New item
				</button>
			</div>

			<InventoryFilters
				filters={filters}
				onChange={setFilters}
				categories={categoriesQuery.data ?? []}
			/>

			<InventoryList
				items={itemsQuery.data ?? []}
				onEdit={(item) => {
					setEditedItem(item);
					setFormOpen(true);
				}}
				onDelete={setItemToDelete}
			/>

			<Modal
				open={formOpen}
				onClose={closeForm}
				title={editedItem ? "Edit item" : "New inventory item"}
				widthClass="max-w-2xl">
				<InventoryForm
					key={editedItem?._id ?? "new"}
					initialValues={editedItem ?? undefined}
					categories={categoriesQuery.data ?? []}
					loading={saveMutation.isPending}
					onSubmit={saveMutation.mutate}
					onCancel={closeForm}
				/>
				{saveMutation.isError && (
					<p className="mt-2 text-xs text-red-600">{saveMutation.error.message}</p>
				)}
			</Modal>

			<ConfirmDialog
				open={Boolean(itemToDelete)}
				title={`Delete "${itemToDelete?.name}"?`}
				description="The item will also be removed from materials of all projects that use it."
				confirmLabel="Delete"
				destructive
				onConfirm={() => {
					deleteMutation.mutate(itemToDelete._id);
					setItemToDelete(null);
				}}
				onCancel={() => setItemToDelete(null)}
			/>
		</div>
	);
};

export { InventoryPage };

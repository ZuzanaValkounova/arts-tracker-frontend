import { useState } from "react";
import { Modal } from "../ui/Modal";

const AddMaterialDialog = ({ open, inventory = [], initialValues, onSubmit, onClose, loading }) => {
	const [inventoryItemId, setInventoryItemId] = useState(initialValues?.inventoryItemId ?? "");
	const [quantity, setQuantity] = useState(initialValues?.quantity ?? 1);
	const [actualCost, setActualCost] = useState(initialValues?.actualCost ?? null);

	const selectedItem = inventory.find((item) => item._id === inventoryItemId);
	const estimated =
		selectedItem?.type === "consumable" && selectedItem.price != null
			? selectedItem.price * (quantity || 0)
			: 0;

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			inventoryItemId,
			quantity: quantity || undefined,
			actualCost: actualCost ?? undefined,
		});
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={initialValues ? "Edit material" : "Add material"}
			widthClass="max-w-md">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Inventory item *</span>
					<select
						value={inventoryItemId}
						onChange={(e) => setInventoryItemId(e.target.value)}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="">Select an item…</option>
						{inventory.map((item) => (
							<option key={item._id} value={item._id}>
								{item.name}
								{item.price != null ? ` (${item.price} ${item.currency})` : ""}
							</option>
						))}
					</select>
				</label>
				<div className="flex gap-4">
					<label className="flex flex-col gap-1 text-sm">
						<span className="text-xs font-medium text-gray-600">Quantity used</span>
						<input
							type="number"
							min={0}
							step="0.01"
							value={quantity ?? ""}
							onChange={(e) => setQuantity(e.target.value === "" ? null : Number(e.target.value))}
							className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
						/>
					</label>
					<label className="flex flex-col gap-1 text-sm">
						<span className="text-xs font-medium text-gray-600">Actual cost</span>
						<input
							type="number"
							min={0}
							step="0.01"
							value={actualCost ?? ""}
							onChange={(e) => setActualCost(e.target.value === "" ? null : Number(e.target.value))}
							className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm"
						/>
					</label>
				</div>
				{selectedItem && (
					<p className="text-xs text-gray-500">
						Estimated cost: {estimated.toLocaleString()} {selectedItem.currency}
						{selectedItem.type === "tool" && " (tools don't count into estimates)"}
					</p>
				)}
				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
						Cancel
					</button>
					<button
						type="submit"
						disabled={!inventoryItemId || loading}
						className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
						{loading ? "Saving…" : initialValues ? "Save" : "Add"}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export { AddMaterialDialog };

import { useState } from "react";

import { FormDialog } from "../ui/shared/FormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
		<FormDialog
			open={open}
			onClose={onClose}
			title={initialValues ? "Edit material" : "Add material"}
			className="sm:max-w-md">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<div className="flex flex-col gap-1.5">
					<Label>Inventory item *</Label>
					<Select value={inventoryItemId || undefined} onValueChange={setInventoryItemId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select an item…" />
						</SelectTrigger>
						<SelectContent>
							{inventory.map((item) => (
								<SelectItem key={item._id} value={item._id}>
									{item.name}
									{item.price != null ? ` (${item.price} ${item.currency})` : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex gap-4">
					<div className="flex flex-col gap-1.5">
						<Label>Quantity used</Label>
						<Input
							type="number"
							min={0}
							step="0.01"
							value={quantity ?? ""}
							onChange={(e) => setQuantity(e.target.value === "" ? null : Number(e.target.value))}
							className="w-24"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>Actual cost</Label>
						<Input
							type="number"
							min={0}
							step="0.01"
							value={actualCost ?? ""}
							onChange={(e) => setActualCost(e.target.value === "" ? null : Number(e.target.value))}
							className="w-28"
						/>
					</div>
				</div>
				{selectedItem && (
					<p className="text-xs text-muted-foreground">
						Estimated cost: {estimated.toLocaleString()} {selectedItem.currency}
						{selectedItem.type === "tool" && " (tools don't count into estimates)"}
					</p>
				)}
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={!inventoryItemId || loading}>
						{loading ? "Saving…" : initialValues ? "Save" : "Add"}
					</Button>
				</div>
			</form>
		</FormDialog>
	);
};

export { AddMaterialDialog };

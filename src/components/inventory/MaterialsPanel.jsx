import { Plus, Pencil, Trash2, Wrench } from "lucide-react";

import { CostSummary } from "./CostSummary";
import { EmptyState } from "../ui/shared/EmptyState";
import { Button } from "@/components/ui/button";

// materials: [{ _id, inventoryItem, quantity, estimatedCost, actualCost }]
const MaterialsPanel = ({ materials, totals, onAdd, onEdit, onRemove }) => {
	return (
		<section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Materials</h3>
				<Button type="button" size="sm" onClick={onAdd}>
					<Plus />
					Add material
				</Button>
			</div>

			{materials.length === 0 ? (
				<EmptyState message="No materials added yet." />
			) : (
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b text-left text-xs text-muted-foreground">
							<th className="py-1.5 font-medium">Item</th>
							<th className="py-1.5 font-medium">Quantity</th>
							<th className="py-1.5 font-medium">Estimated</th>
							<th className="py-1.5 font-medium">Actual</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{materials.map((material) => (
							<tr key={material._id} className="border-b">
								<td className="py-2">
									{material.inventoryItem?.name ?? "(deleted item)"}
									{material.inventoryItem?.type === "tool" && (
										<Wrench className="ml-1 inline size-3 align-[-1px] text-muted-foreground" />
									)}
								</td>
								<td className="py-2">{material.quantity ?? "—"}</td>
								<td className="py-2">
									{material.estimatedCost != null ? material.estimatedCost.toLocaleString() : "—"}
								</td>
								<td className="py-2">
									{material.actualCost != null ? material.actualCost.toLocaleString() : "—"}
								</td>
								<td className="py-2">
									<div className="flex justify-end gap-1">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label="Edit material"
											onClick={() => onEdit(material)}>
											<Pencil />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label="Remove material"
											className="text-destructive hover:text-destructive"
											onClick={() => onRemove(material)}>
											<Trash2 />
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<CostSummary totals={totals} />
		</section>
	);
};

export { MaterialsPanel };

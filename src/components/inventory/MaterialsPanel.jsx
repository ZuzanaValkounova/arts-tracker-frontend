import { CostSummary } from "./CostSummary";
import { EmptyState } from "../ui/EmptyState";

// materials: [{ _id, inventoryItem, quantity, estimatedCost, actualCost }]
const MaterialsPanel = ({ materials, totals, onAdd, onEdit, onRemove }) => {
	return (
		<section className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Materials</h3>
				<button
					type="button"
					onClick={onAdd}
					className="rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700">
					+ Add material
				</button>
			</div>

			{materials.length === 0 ? (
				<EmptyState message="No materials added yet." />
			) : (
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200 text-left text-xs text-gray-500">
							<th className="py-1.5 font-medium">Item</th>
							<th className="py-1.5 font-medium">Quantity</th>
							<th className="py-1.5 font-medium">Estimated</th>
							<th className="py-1.5 font-medium">Actual</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{materials.map((material) => (
							<tr key={material._id} className="border-b border-gray-100">
								<td className="py-2">
									{material.inventoryItem?.name ?? "(deleted item)"}
									{material.inventoryItem?.type === "tool" && (
										<span className="ml-1 text-xs text-gray-400">🔧</span>
									)}
								</td>
								<td className="py-2">{material.quantity ?? "—"}</td>
								<td className="py-2">
									{material.estimatedCost != null ? material.estimatedCost.toLocaleString() : "—"}
								</td>
								<td className="py-2">
									{material.actualCost != null ? material.actualCost.toLocaleString() : "—"}
								</td>
								<td className="py-2 text-right">
									<button
										type="button"
										onClick={() => onEdit(material)}
										className="mr-2 text-xs text-gray-500 hover:text-gray-800">
										Edit
									</button>
									<button
										type="button"
										onClick={() => onRemove(material)}
										className="text-xs text-red-500 hover:text-red-700">
										Remove
									</button>
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

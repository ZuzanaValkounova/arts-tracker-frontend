// item: { _id, name, description, type, image, quantity, status, price, currency, source, categoryIds }
const InventoryCard = ({ item, onEdit, onDelete }) => {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			{item.image?.url && (
				<img src={item.image.url} alt={item.name} className="h-28 w-full object-cover" />
			)}
			<div className="flex flex-1 flex-col gap-1.5 p-3">
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-sm font-semibold">{item.name}</h3>
					<span
						className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
							item.status === "owned"
								? "bg-green-100 text-green-700"
								: "bg-purple-100 text-purple-700"
						}`}>
						{item.status === "owned" ? "Owned" : "Wishlist"}
					</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-gray-500">
					<span>{item.type === "tool" ? "🔧 Tool" : "🧵 Consumable"}</span>
					<span>×{item.quantity}</span>
					{item.price != null && (
						<span>
							{item.price} {item.currency}
						</span>
					)}
				</div>
				{item.source && (
					<a
						href={item.source}
						target="_blank"
						rel="noreferrer"
						className="truncate text-xs text-blue-600 hover:underline">
						{item.source}
					</a>
				)}
				<div className="mt-auto flex justify-end gap-2 pt-1">
					<button
						type="button"
						onClick={() => onEdit(item)}
						className="text-xs text-gray-500 hover:text-gray-800">
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(item)}
						className="text-xs text-red-500 hover:text-red-700">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export { InventoryCard };

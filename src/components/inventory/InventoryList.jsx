import { InventoryCard } from "./InventoryCard";
import { EmptyState } from "../ui/EmptyState";

const InventoryList = ({ items, onEdit, onDelete }) => {
	if (items.length === 0) {
		return <EmptyState message="No inventory items match the filters." />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{items.map((item) => (
				<InventoryCard key={item._id} item={item} onEdit={onEdit} onDelete={onDelete} />
			))}
		</div>
	);
};

export { InventoryList };

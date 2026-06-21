import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// item: { _id, name, description, type, image, quantity, status, price, currency, source, categoryIds }
const InventoryCard = ({ item, onEdit, onDelete }) => {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
			{item.image?.url && (
				<img src={item.image.url} alt={item.name} className="h-28 w-full object-cover" />
			)}
			<div className="flex flex-1 flex-col gap-1.5 p-3">
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-sm font-semibold">{item.name}</h3>
					<Badge
						className={cn(
							"rounded-full",
							item.status === "owned"
								? "bg-green-100 text-green-700"
								: "bg-purple-100 text-purple-700",
						)}>
						{item.status === "owned" ? "Owned" : "Wishlist"}
					</Badge>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
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
						className="truncate text-xs text-primary hover:underline">
						{item.source}
					</a>
				)}
				<div className="mt-auto flex justify-end gap-1 pt-1">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="Edit item"
						onClick={() => onEdit(item)}>
						<Pencil />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="Delete item"
						onClick={() => onDelete(item)}>
						<Trash2 />
					</Button>
				</div>
			</div>
		</div>
	);
};

export { InventoryCard };

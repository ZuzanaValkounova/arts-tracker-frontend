import { Link as LinkIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

// resource: { _id, type: "image"|"link", url, publicId?, description, projectId? }
const ResourceCard = ({ resource, onDelete }) => {
	return (
		<div className="group relative overflow-hidden rounded-lg border bg-card">
			{resource.type === "image" ? (
				<img
					src={resource.url}
					alt={resource.description ?? "Resource"}
					className="h-40 w-full object-cover"
				/>
			) : (
				<a
					href={resource.url}
					target="_blank"
					rel="noreferrer"
					className="flex h-40 flex-col items-center justify-center gap-2 p-3 text-center hover:bg-muted">
					<LinkIcon className="size-6 text-muted-foreground" />
					<span className="line-clamp-2 break-all text-xs text-primary">{resource.url}</span>
				</a>
			)}
			{resource.description && (
				<p className="truncate px-2 py-1.5 text-xs text-muted-foreground">{resource.description}</p>
			)}
			{onDelete && (
				<Button
					type="button"
					variant="destructive"
					size="icon-sm"
					aria-label="Delete resource"
					onClick={() => onDelete(resource)}
					className="invisible absolute top-1.5 right-1.5 shadow group-hover:visible">
					<Trash2 />
				</Button>
			)}
		</div>
	);
};

export { ResourceCard };

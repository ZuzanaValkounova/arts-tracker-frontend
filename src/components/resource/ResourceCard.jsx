import { useState } from "react";

import { Link as LinkIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// resource: { _id, type: "image"|"link", url, publicId?, description, projectId? }
const ResourceCard = ({ resource, onDelete }) => {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const isImage = resource.type === "image";

	return (
		<div className="group relative overflow-hidden rounded-lg border bg-card">
			{isImage ? (
				<button
					type="button"
					onClick={() => setLightboxOpen(true)}
					className="block w-full cursor-zoom-in"
					aria-label="View full size">
					<img
						src={resource.url}
						alt={resource.description ?? "Resource"}
						className="h-40 w-full object-cover transition-opacity hover:opacity-90"
					/>
				</button>
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
			{isImage && (
				<Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
					<DialogContent className="border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-5xl">
						<DialogTitle className="sr-only">{resource.description ?? "Image preview"}</DialogTitle>
						<img
							src={resource.url}
							alt={resource.description ?? "Resource"}
							className="mx-auto max-h-[85vh] w-auto rounded-lg object-contain"
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export { ResourceCard };

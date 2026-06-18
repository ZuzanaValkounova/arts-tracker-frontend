// resource: { _id, type: "image"|"link", url, publicId?, description, projectId? }
const ResourceCard = ({ resource, onDelete }) => {
	return (
		<div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
			{resource.type === "image" ? (
				<img src={resource.url} alt={resource.description ?? "Resource"} className="h-40 w-full object-cover" />
			) : (
				<a
					href={resource.url}
					target="_blank"
					rel="noreferrer"
					className="flex h-40 flex-col items-center justify-center gap-2 p-3 text-center hover:bg-gray-50"
				>
					<span className="text-2xl">🔗</span>
					<span className="line-clamp-2 break-all text-xs text-blue-600">{resource.url}</span>
				</a>
			)}
			{resource.description && (
				<p className="truncate px-2 py-1.5 text-xs text-gray-600">{resource.description}</p>
			)}
			{onDelete && (
				<button
					type="button"
					onClick={() => onDelete(resource)}
					className="invisible absolute right-1.5 top-1.5 rounded bg-white/90 px-1.5 py-0.5 text-xs text-red-600 shadow group-hover:visible"
				>
					Delete
				</button>
			)}
		</div>
	);
};

export { ResourceCard };

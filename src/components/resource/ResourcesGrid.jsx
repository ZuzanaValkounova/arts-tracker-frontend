import { ResourceCard } from "./ResourceCard";
import { EmptyState } from "../ui/EmptyState";

const ResourcesGrid = ({ resources, onDelete }) => {
	if (resources.length === 0) {
		return <EmptyState message="No images or links saved yet." />;
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{resources.map((resource) => (
				<ResourceCard key={resource._id} resource={resource} onDelete={onDelete} />
			))}
		</div>
	);
};

export { ResourcesGrid };

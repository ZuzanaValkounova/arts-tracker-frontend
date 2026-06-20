import { ProgressBar } from "../ui/shared/ProgressBar";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { TagChip } from "../ui/shared/TagChip";
import { ProjectStatusControl } from "./ProjectStatusControl";

// progress (0–100) is computed on the FE from the project's tasks
const ProjectDetailHeader = ({ project, progress, onEdit, onDelete, onStatusChange }) => {
	return (
		<header className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex items-center gap-4">
					{project.image?.url && (
						<img
							src={project.image.url}
							alt={project.name}
							className="h-16 w-16 rounded-lg object-cover"
						/>
					)}
					<div>
						<h1
							className="text-xl font-bold"
							style={project.color ? { color: project.color } : undefined}>
							{project.name}
						</h1>
						<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
							{project.category && (
								<span>
									{project.category.icon} {project.category.name}
								</span>
							)}
							{project.difficulty && <DifficultyRating value={project.difficulty} readOnly />}
							{project.deadline && (
								<span>Due {new Date(project.deadline).toLocaleDateString()}</span>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ProjectStatusControl value={project.status} onChange={onStatusChange} />
					<button
						type="button"
						onClick={onEdit}
						className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
						Edit
					</button>
					<button
						type="button"
						onClick={onDelete}
						className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
						Delete
					</button>
				</div>
			</div>
			{project.description && <p className="text-sm text-gray-600">{project.description}</p>}
			{project.tags?.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{project.tags.map((tag) => (
						<TagChip key={tag._id} tag={tag} />
					))}
				</div>
			)}
			<ProgressBar value={progress} showLabel />
		</header>
	);
};

export { ProjectDetailHeader };

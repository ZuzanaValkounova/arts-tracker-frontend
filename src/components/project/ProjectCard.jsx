import { StatusBadge } from "../ui/StatusBadge";
import { DifficultyRating } from "../ui/DifficultyRating";
import { ProgressBar } from "../ui/ProgressBar";
import { TagChip } from "../ui/TagChip";

const ProjectCard = ({ project, progress, onOpen, onEdit, onDelete }) => {
	return (
		<div
			onClick={onOpen}
			className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
			style={project.color ? { borderTopColor: project.color, borderTopWidth: 3 } : undefined}>
			{project.image?.url && (
				<img src={project.image.url} alt={project.name} className="h-32 w-full object-cover" />
			)}
			<div className="flex flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<h2 className="text-base font-semibold">{project.name}</h2>
					<StatusBadge status={project.status} size="sm" />
				</div>
				{project.category && (
					<div className="text-xs text-gray-500">
						{project.category.icon} {project.category.name}
					</div>
				)}
				{project.tags?.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{project.tags.map((tag) => (
							<TagChip key={tag._id} tag={tag} />
						))}
					</div>
				)}
				<div className="flex items-center justify-between text-xs text-gray-500">
					{project.difficulty ? <DifficultyRating value={project.difficulty} readOnly /> : <span />}
					{project.deadline && <span>Due {new Date(project.deadline).toLocaleDateString()}</span>}
				</div>
				{progress != null ? (
					<ProgressBar value={progress} showLabel />
				) : project.taskStats ? (
					<ProgressBar
						completed={project.taskStats.completed}
						total={project.taskStats.total}
						showLabel
					/>
				) : null}
				{(onEdit || onDelete) && (
					<div className="flex justify-end gap-2 pt-1">
						{onEdit && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
								}}
								className="text-xs text-gray-500 hover:text-gray-800">
								Edit
							</button>
						)}
						{onDelete && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}
								className="text-xs text-red-500 hover:text-red-700">
								Delete
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export { ProjectCard };

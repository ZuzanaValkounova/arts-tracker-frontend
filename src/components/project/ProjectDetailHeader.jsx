import { ProgressBar } from "../ui/shared/ProgressBar";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { TagChip } from "../ui/shared/TagChip";
import { CategoryIcon } from "../ui/shared/CategoryIcon";

const ProjectDetailHeader = ({ project, progress }) => {
	return (
		<header className="flex flex-col gap-3 rounded-lg border bg-card p-5">
			<div className="flex flex-wrap items-start gap-4">
				{project.image?.url && (
					<img
						src={project.image.url}
						alt={project.name}
						className="h-16 w-16 rounded-lg object-cover"
					/>
				)}
				<div className="flex flex-col gap-1">
					<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						{project.category && (
							<span className="inline-flex items-center gap-1">
								<CategoryIcon name={project.category.icon} className="size-4" />
								{project.category.name}
							</span>
						)}
						{project.difficulty && <DifficultyRating value={project.difficulty} readOnly />}
						{project.deadline && <span>Due {new Date(project.deadline).toLocaleDateString()}</span>}
					</div>
					{project.description && (
						<p className="text-sm text-muted-foreground">{project.description}</p>
					)}
				</div>
			</div>
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

import { Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "../ui/shared/StatusBadge";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { ProgressBar } from "../ui/shared/ProgressBar";
import { TagChip } from "../ui/shared/TagChip";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project, progress, onOpen, onEdit, onDelete }) => {
	return (
		<div
			onClick={onOpen}
			className="cursor-pointer overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition hover:shadow-md"
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
					<div className="text-xs text-muted-foreground">
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
				<div className="flex items-center justify-between text-xs text-muted-foreground">
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
					<div className="flex justify-end gap-1 pt-1">
						{onEdit && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Edit project"
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
								}}>
								<Pencil />
							</Button>
						)}
						{onDelete && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Delete project"
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}>
								<Trash2 />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export { ProjectCard };

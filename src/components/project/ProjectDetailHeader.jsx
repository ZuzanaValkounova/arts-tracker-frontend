import { Pencil, Trash2 } from "lucide-react";

import { ProgressBar } from "../ui/shared/ProgressBar";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { TagChip } from "../ui/shared/TagChip";
import { Button } from "@/components/ui/button";
import { ProjectStatusControl } from "./ProjectStatusControl";

const ProjectDetailHeader = ({ project, progress, onEdit, onDelete, onStatusChange }) => {
	return (
		<header className="flex flex-col gap-3 rounded-lg border bg-card p-5">
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
						<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
					<Button type="button" variant="outline" onClick={onEdit}>
						<Pencil />
						Edit
					</Button>
					<Button type="button" variant="destructive" onClick={onDelete}>
						<Trash2 />
						Delete
					</Button>
				</div>
			</div>
			{project.description && (
				<p className="text-sm text-muted-foreground">{project.description}</p>
			)}
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

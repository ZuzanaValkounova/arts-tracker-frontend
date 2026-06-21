import { Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "../ui/shared/StatusBadge";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { ProgressBar } from "../ui/shared/ProgressBar";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project, progress, onOpen, onEdit, onDelete }) => {
	const accent = project.color ?? null;
	const stop = (fn) => (e) => {
		e.stopPropagation();
		fn();
	};

	return (
		<div
			onClick={onOpen}
			className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md">
			{accent && <div className="h-2 w-full shrink-0" style={{ backgroundColor: accent }} />}

			{/* image hero (the focus); colored placeholder block when there's no image */}
			<div className="relative aspect-video w-full overflow-hidden bg-muted">
				{project.image?.url ? (
					<img
						src={project.image.url}
						alt={project.name}
						className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
					/>
				) : (
					<div
						className="flex size-full items-center justify-center"
						style={{ backgroundColor: accent ?? "var(--muted)" }}>
						<span className="text-4xl font-bold text-white/90 drop-shadow-sm">
							{project.name?.[0]?.toUpperCase() ?? "?"}
						</span>
					</div>
				)}

				<div className="absolute top-2 right-2">
					<StatusBadge status={project.status} size="sm" />
				</div>

				{(onEdit || onDelete) && (
					<div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
						{onEdit && (
							<Button
								type="button"
								variant="secondary"
								size="icon-sm"
								aria-label="Edit project"
								onClick={stop(onEdit)}>
								<Pencil />
							</Button>
						)}
						{onDelete && (
							<Button
								type="button"
								variant="secondary"
								size="icon-sm"
								aria-label="Delete project"
								onClick={stop(onDelete)}>
								<Trash2 />
							</Button>
						)}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2 p-3">
				<div className="flex items-center justify-between gap-2">
					<h2 className="truncate font-semibold">{project.name}</h2>
					{project.difficulty ? <DifficultyRating value={project.difficulty} readOnly /> : null}
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
			</div>
		</div>
	);
};

export { ProjectCard };

import { ProjectCard } from "./ProjectCard";

const ProjectsGrid = ({ projects, onOpen, onEdit, onDelete }) => {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			{projects.map((project) => (
				<ProjectCard
					key={project._id}
					project={project}
					onOpen={() => onOpen(project._id)}
					onEdit={onEdit ? () => onEdit(project) : undefined}
					onDelete={onDelete ? () => onDelete(project) : undefined}
				/>
			))}
		</div>
	);
};

export { ProjectsGrid };

import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { ProjectDetailHeader } from "../components/project/ProjectDetailHeader";
import { ProjectTabs } from "../components/project/ProjectTabs";
import { ProjectForm } from "../components/project/ProjectForm";
import { ReflectionDialog } from "../components/project/ReflectionDialog";
import { ReflectionCard } from "../components/project/ReflectionCard";
import { ProjectStatusControl } from "../components/project/ProjectStatusControl";
import { FormDialog } from "../components/ui/shared/FormDialog";
import { ConfirmDialog } from "../components/ui/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";

import { TasksTab } from "./projectDetail/TasksTab";
import { MoodboardTab } from "./projectDetail/MoodboardTab";
import { MaterialsTab } from "./projectDetail/MaterialsTab";
import { ResourcesTab } from "./projectDetail/ResourcesTab";

import { getProject, updateProject, deleteProject, upsertProjectReflection } from "../api/projects";
import { getTasks } from "../api/tasks";
import { getCategories } from "../api/categories";
import { getTags, createTag } from "../api/tags";
import { useAuth } from "../contexts/AuthContext";
import { computeProgress } from "../utils/tasks";

const ProjectDetailPage = () => {
	const { projectId } = useParams();
	const [token] = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [tab, setTab] = useState("tasks");
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [reflectionOpen, setReflectionOpen] = useState(false);

	const projectQuery = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProject(token, projectId),
	});

	const tasksQuery = useQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => getTasks(token, { projectId }),
	});
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(token),
	});
	const tagsQuery = useQuery({ queryKey: ["tags"], queryFn: () => getTags(token) });

	const project = projectQuery.data;

	const invalidateProject = () => {
		queryClient.invalidateQueries({ queryKey: ["project", projectId] });
		queryClient.invalidateQueries({ queryKey: ["projects"] });
	};

	const handleCascade = (result) => {
		if (result?.project) invalidateProject();
		if (result?.triggerReflection) setReflectionOpen(true);
	};

	const updateMutation = useMutation({
		mutationFn: (values) => updateProject(token, projectId, values),
		onSuccess: (result) => {
			toast.success("Project updated");
			invalidateProject();
			setEditOpen(false);
			handleCascade(result);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteProject(token, projectId),
		onSuccess: () => {
			toast.success("Project deleted");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			navigate("/");
		},
	});

	const reflectionMutation = useMutation({
		mutationFn: async ({ difficulty, ...reflection }) => {
			await upsertProjectReflection(token, projectId, reflection);
			if (difficulty && difficulty !== project?.difficulty) {
				await updateProject(token, projectId, { difficulty });
			}
		},
		onSuccess: () => {
			toast.success("Reflection saved");
			invalidateProject();
			setReflectionOpen(false);
		},
	});

	const createTagMutation = useMutation({
		mutationFn: ({ name, color }) => createTag(token, { name, color }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
	});

	const categories = categoriesQuery.data ?? [];
	const tags = tagsQuery.data ?? [];

	const enrichedProject = useMemo(() => {
		if (!project) return null;
		const allCategories = categories;
		const allTags = tags;
		return {
			...project,
			category: allCategories.find((c) => c._id === project.categoryId),
			tags: (project.tagIds ?? []).map((id) => allTags.find((t) => t._id === id)).filter(Boolean),
		};
	}, [project, categoriesQuery.data, tagsQuery.data]);

	if (projectQuery.isLoading) return <LoadingState />;
	if (projectQuery.isError)
		return <ErrorState message={projectQuery.error.message} onRetry={projectQuery.refetch} />;

	const progress = computeProgress(tasksQuery.data ?? []);

	return (
		<div className="flex flex-col gap-4">
			{/* bar: name + status + edit + delete */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1
					className="text-xl font-bold"
					style={project.color ? { color: project.color } : undefined}>
					{project.name}
				</h1>
				<div className="flex items-center gap-2">
					<ProjectStatusControl
						value={project.status}
						onChange={(status) => updateMutation.mutate({ status })}
					/>
					<Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit
					</Button>
					<Button type="button" variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
						<Trash2 />
						Delete
					</Button>
				</div>
			</div>

			<ProjectTabs value={tab} onChange={setTab} />

			{tab !== "moodboard" && (
				<>
					<ProjectDetailHeader project={enrichedProject} progress={progress.percent} />

					{project.reflection && (
						<ReflectionCard
							reflection={project.reflection}
							onEdit={() => setReflectionOpen(true)}
						/>
					)}
				</>
			)}

			{tab === "tasks" && <TasksTab project={project} onCascade={handleCascade} />}
			{tab === "moodboard" && <MoodboardTab project={project} />}
			{tab === "materials" && <MaterialsTab project={project} />}
			{tab === "resources" && <ResourcesTab project={project} />}

			<FormDialog
				open={editOpen}
				onClose={() => setEditOpen(false)}
				title="Edit project"
				className="sm:max-w-2xl">
				<ProjectForm
					key={project.updatedAt}
					initialValues={project}
					categories={categories}
					tags={tags}
					loading={updateMutation.isPending}
					onSubmit={updateMutation.mutate}
					onCreateTag={(name, color) => createTagMutation.mutate({ name, color })}
					onCancel={() => setEditOpen(false)}
				/>
			</FormDialog>

			<ReflectionDialog
				key={`${reflectionOpen}-${project.updatedAt}`}
				open={reflectionOpen}
				initialValues={
					project.reflection
						? { ...project.reflection, difficulty: project.difficulty }
						: { difficulty: project.difficulty }
				}
				loading={reflectionMutation.isPending}
				onSubmit={reflectionMutation.mutate}
				onClose={() => setReflectionOpen(false)}
			/>

			<ConfirmDialog
				open={deleteOpen}
				title={`Delete project "${project.name}"?`}
				description="All its tasks, moodboard and resources will be deleted too. This cannot be undone."
				confirmLabel="Delete project"
				destructive
				onConfirm={() => deleteMutation.mutate()}
				onCancel={() => setDeleteOpen(false)}
			/>
		</div>
	);
};

export { ProjectDetailPage };

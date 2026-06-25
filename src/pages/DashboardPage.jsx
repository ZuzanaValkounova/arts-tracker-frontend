import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";

import { ProjectsGrid } from "../components/project/ProjectsGrid";
import { ProjectKanbanBoard } from "../components/project/ProjectKanbanBoard";
import { ProjectForm } from "../components/project/ProjectForm";
import { ViewSwitcher } from "../components/ui/shared/ViewSwitcher";
import { CategoryPicker } from "../components/ui/shared/CategoryPicker";
import { TagChip } from "../components/ui/shared/TagChip";
import { FormDialog } from "../components/ui/shared/FormDialog";
import { ConfirmDialog } from "../components/ui/shared/ConfirmDialog";
import { NewButton } from "../components/ui/shared/NewButton";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";
import { EmptyState } from "../components/ui/shared/EmptyState";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { getProjects, createProject, updateProject, deleteProject } from "../api/projects";
import { getCategories } from "../api/categories";
import { getTags, createTag } from "../api/tags";
import { useAuth } from "../contexts/AuthContext";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { PROJECT_STATUSES, STATUS_META } from "../utils/constants";

const SORT_OPTIONS = [
	{ id: "updatedAt", label: "Last modified" },
	{ id: "createdAt", label: "Newest" },
	{ id: "name", label: "Name (A–Z)" },
	{ id: "deadline", label: "Deadline" },
];
const DEFAULT_SORT = "updatedAt";

const time = (value, fallback) => (value ? new Date(value).getTime() : fallback);
const SORTERS = {
	updatedAt: (a, b) => time(b.updatedAt, 0) - time(a.updatedAt, 0),
	createdAt: (a, b) => time(b.createdAt, 0) - time(a.createdAt, 0),
	name: (a, b) => a.name.localeCompare(b.name),
	deadline: (a, b) => {
		const aT = time(a.deadline, Infinity);
		const bT = time(b.deadline, Infinity);
		return aT < bT ? -1 : aT > bT ? 1 : 0;
	},
};

// Dashboard = the projects hub: search + filters, status summary, sorting (last modified first)
const DashboardPage = () => {
	const [token] = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { get, set: updateParams } = useUrlFilters();

	const search = get("search");
	const categoryId = get("category") || null;
	const tagsParam = get("tags");
	const statusParam = get("status"); // empty = all statuses
	const sort = get("sort") || DEFAULT_SORT;
	const view = get("view") || "grid";

	const selectedTagIds = useMemo(() => tagsParam.split(",").filter(Boolean), [tagsParam]);
	const selectedStatuses = useMemo(() => statusParam.split(",").filter(Boolean), [statusParam]);

	const [formOpen, setFormOpen] = useState(false);
	const [editedProject, setEditedProject] = useState(null);
	const [projectToDelete, setProjectToDelete] = useState(null);

	const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: () => getProjects(token) });
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(token),
	});
	const tagsQuery = useQuery({ queryKey: ["tags"], queryFn: () => getTags(token) });

	const saveMutation = useMutation({
		mutationFn: (values) =>
			editedProject
				? updateProject(token, editedProject._id, values)
				: createProject(token, values),
		onSuccess: () => {
			toast.success(editedProject ? "Project updated" : "Project created");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			closeForm();
		},
	});
	const deleteMutation = useMutation({
		mutationFn: (projectId) => deleteProject(token, projectId),
		onSuccess: () => {
			toast.success("Project deleted");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
	const createTagMutation = useMutation({
		mutationFn: ({ name, color }) => createTag(token, { name, color }),
		onSuccess: () => {
			toast.success("Tag created");
			queryClient.invalidateQueries({ queryKey: ["tags"] });
		},
	});

	// kanban
	const statusMutation = useMutation({
		mutationFn: ({ projectId, status }) => updateProject(token, projectId, { status }),
		onMutate: ({ projectId, status }) => {
			queryClient.cancelQueries({ queryKey: ["projects"] });
			const previous = queryClient.getQueryData(["projects"]);
			queryClient.setQueryData(["projects"], (old) =>
				(old ?? []).map((p) => (p._id === projectId ? { ...p, status } : p)),
			);
			return { previous };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(["projects"], ctx.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
	});

	const closeForm = () => {
		setFormOpen(false);
		setEditedProject(null);
	};

	const toggleStatus = (status) =>
		updateParams({
			status: selectedStatuses.includes(status)
				? selectedStatuses.filter((s) => s !== status)
				: [...selectedStatuses, status],
		});
	const toggleTag = (tagId) =>
		updateParams({
			tags: selectedTagIds.includes(tagId)
				? selectedTagIds.filter((id) => id !== tagId)
				: [...selectedTagIds, tagId],
		});

	// enrich + filter + count
	// context matches search/category/tags, ignores status
	const { statusCounts, contextCount, visibleProjects, contextProjects } = useMemo(() => {
		const categoriesById = new Map((categoriesQuery.data ?? []).map((c) => [c._id, c]));
		const tagsById = new Map((tagsQuery.data ?? []).map((t) => [t._id, t]));

		const enriched = (projectsQuery.data ?? []).map((project) => ({
			...project,
			category: categoriesById.get(project.categoryId),
			tags: (project.tagIds ?? []).map((id) => tagsById.get(id)).filter(Boolean),
		}));

		const searchLower = search.trim().toLowerCase();
		const context = enriched.filter((project) => {
			if (searchLower && !project.name.toLowerCase().includes(searchLower)) return false;
			if (categoryId && project.categoryId !== categoryId) return false;
			if (
				selectedTagIds.length &&
				!selectedTagIds.every((id) => (project.tagIds ?? []).includes(id))
			)
				return false;
			return true;
		});

		const counts = Object.fromEntries(PROJECT_STATUSES.map((status) => [status, 0]));
		context.forEach((project) => {
			counts[project.status] = (counts[project.status] ?? 0) + 1;
		});

		const visible = context
			.filter(
				(project) => selectedStatuses.length === 0 || selectedStatuses.includes(project.status),
			)
			.sort(SORTERS[sort]);

		return {
			statusCounts: counts,
			contextCount: context.length,
			visibleProjects: visible,
			contextProjects: [...context].sort(SORTERS[sort]),
		};
	}, [
		projectsQuery.data,
		categoriesQuery.data,
		tagsQuery.data,
		search,
		categoryId,
		selectedTagIds,
		selectedStatuses,
		sort,
	]);

	if (projectsQuery.isLoading) return <LoadingState />;
	if (projectsQuery.isError)
		return <ErrorState message={projectsQuery.error.message} onRetry={projectsQuery.refetch} />;

	const hasNoProjects = (projectsQuery.data ?? []).length === 0;
	const tags = tagsQuery.data ?? [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-xl font-bold">Projects</h1>
				<NewButton label="New project" onClick={() => setFormOpen(true)} />
			</div>

			{/* search + category + tag filters and sorting */}
			{!hasNoProjects && (
				<div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative w-56">
							<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								value={search}
								onChange={(e) => updateParams({ search: e.target.value })}
								placeholder="Search projects…"
								className="pl-8"
							/>
						</div>
						<CategoryPicker
							value={categoryId}
							options={categoriesQuery.data ?? []}
							onChange={(id) => updateParams({ category: id })}
						/>
						<div className="ml-auto flex items-center gap-2">
							<span className="text-xs text-muted-foreground">Sort</span>
							<Select
								value={sort}
								onValueChange={(next) =>
									updateParams({ sort: next === DEFAULT_SORT ? null : next })
								}>
								<SelectTrigger size="sm" className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{SORT_OPTIONS.map((option) => (
										<SelectItem key={option.id} value={option.id}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					{tags.length > 0 && (
						<div className="flex flex-wrap items-center gap-1.5">
							{tags.map((tag) => (
								<TagChip
									key={tag._id}
									tag={tag}
									selected={selectedTagIds.includes(tag._id)}
									onClick={() => toggleTag(tag._id)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{!hasNoProjects && (
				<div className="flex items-center gap-3">
					<ViewSwitcher
						value={view}
						onChange={(next) => updateParams({ view: next === "grid" ? null : next })}
						options={["grid", "kanban"]}
					/>
				</div>
			)}

			{/* status quick-filters*/}
			{!hasNoProjects && view === "grid" && (
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={() => updateParams({ status: [] })}
						className={cn(
							"rounded-full px-3 py-1 text-sm transition-colors",
							selectedStatuses.length === 0
								? "bg-foreground text-background"
								: "bg-muted text-muted-foreground hover:bg-muted/70",
						)}>
						All <span className="font-semibold">{contextCount}</span>
					</button>
					{PROJECT_STATUSES.filter(
						(status) => statusCounts[status] > 0 || selectedStatuses.includes(status),
					).map((status) => (
						<button
							key={status}
							type="button"
							onClick={() => toggleStatus(status)}
							className={cn(
								"rounded-full px-3 py-1 text-sm font-medium transition-all",
								STATUS_META[status].className,
								selectedStatuses.includes(status)
									? "ring-2 ring-ring ring-offset-1"
									: "opacity-80 hover:opacity-100",
							)}>
							{STATUS_META[status].label} <span className="font-bold">{statusCounts[status]}</span>
						</button>
					))}
				</div>
			)}

			{hasNoProjects ? (
				<EmptyState
					message="Welcome! Create your first project to start tracking your work."
					action={{ label: "Create your first project", onClick: () => setFormOpen(true) }}
				/>
			) : view === "kanban" ? (
				<ProjectKanbanBoard
					projects={contextProjects}
					onMove={(projectId, status) => statusMutation.mutate({ projectId, status })}
					onOpen={(projectId) => navigate(`/projects/${projectId}`)}
				/>
			) : visibleProjects.length === 0 ? (
				<EmptyState message="No projects match the current filters." />
			) : (
				<ProjectsGrid
					projects={visibleProjects}
					onOpen={(projectId) => navigate(`/projects/${projectId}`)}
					onEdit={(project) => {
						setEditedProject(project);
						setFormOpen(true);
					}}
					onDelete={setProjectToDelete}
				/>
			)}

			<FormDialog
				open={formOpen}
				onClose={closeForm}
				title={editedProject ? "Edit project" : "New project"}
				className="sm:max-w-2xl">
				<ProjectForm
					key={editedProject?._id ?? "new"}
					initialValues={editedProject ?? undefined}
					categories={categoriesQuery.data ?? []}
					tags={tags}
					loading={saveMutation.isPending}
					onSubmit={saveMutation.mutate}
					onCreateTag={(name, color) => createTagMutation.mutate({ name, color })}
					onCancel={closeForm}
				/>
			</FormDialog>

			<ConfirmDialog
				open={Boolean(projectToDelete)}
				title={`Delete project "${projectToDelete?.name}"?`}
				description="All its tasks, moodboard and resources will be deleted too. This cannot be undone."
				confirmLabel="Delete project"
				destructive
				onConfirm={() => {
					deleteMutation.mutate(projectToDelete._id);
					setProjectToDelete(null);
				}}
				onCancel={() => setProjectToDelete(null)}
			/>
		</div>
	);
};

export { DashboardPage };

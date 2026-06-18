import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { ProjectsGrid } from "../components/project/ProjectsGrid";
import { ProjectForm } from "../components/project/ProjectForm";
import { CategoryPicker } from "../components/ui/CategoryPicker";
import { TagChip } from "../components/ui/TagChip";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

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
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			closeForm();
		},
	});
	const deleteMutation = useMutation({
		mutationFn: (projectId) => deleteProject(token, projectId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
	});
	const createTagMutation = useMutation({
		mutationFn: ({ name, color }) => createTag(token, { name, color }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
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

	// enrich + filter + count in one pass
	// context matches search/category/tags but ignores status
	const { statusCounts, contextCount, visibleProjects } = useMemo(() => {
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

		return { statusCounts: counts, contextCount: context.length, visibleProjects: visible };
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
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">Projects</h1>
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
					+ New project
				</button>
			</div>

			{/* summary strip: status counts that are also quick filters */}
			{!hasNoProjects && (
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={() => updateParams({ status: [] })}
						className={`rounded-full px-3 py-1 text-sm ${
							selectedStatuses.length === 0
								? "bg-gray-900 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						All <span className="font-semibold">{contextCount}</span>
					</button>
					{PROJECT_STATUSES.filter(
						(status) => statusCounts[status] > 0 || selectedStatuses.includes(status),
					).map((status) => (
						<button
							key={status}
							type="button"
							onClick={() => toggleStatus(status)}
							className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_META[status].className} ${
								selectedStatuses.includes(status)
									? "ring-2 ring-gray-900 ring-offset-1"
									: "opacity-80 hover:opacity-100"
							}`}>
							{STATUS_META[status].label} <span className="font-bold">{statusCounts[status]}</span>
						</button>
					))}
				</div>
			)}

			{/* search + category + tag filters and sorting */}
			{!hasNoProjects && (
				<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
					<div className="flex flex-wrap items-center gap-3">
						<input
							type="search"
							value={search}
							onChange={(e) => updateParams({ search: e.target.value })}
							placeholder="Search projects…"
							className="w-56 rounded border border-gray-300 px-2 py-1.5 text-sm"
						/>
						<CategoryPicker
							value={categoryId}
							options={categoriesQuery.data ?? []}
							onChange={(id) => updateParams({ category: id })}
						/>
						<div className="ml-auto flex items-center gap-2">
							<label className="text-xs text-gray-500">Sort</label>
							<select
								value={sort}
								onChange={(e) =>
									updateParams({ sort: e.target.value === DEFAULT_SORT ? null : e.target.value })
								}
								className="rounded border border-gray-300 px-2 py-1.5 text-sm">
								{SORT_OPTIONS.map((option) => (
									<option key={option.id} value={option.id}>
										{option.label}
									</option>
								))}
							</select>
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

			{visibleProjects.length === 0 ? (
				hasNoProjects ? (
					<EmptyState
						message="Welcome! Create your first project to start tracking your work."
						action={{ label: "Create your first project", onClick: () => setFormOpen(true) }}
					/>
				) : (
					<EmptyState message="No projects match the current filters." />
				)
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

			<Modal
				open={formOpen}
				onClose={closeForm}
				title={editedProject ? "Edit project" : "New project"}
				widthClass="max-w-2xl">
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
				{saveMutation.isError && (
					<p className="mt-2 text-xs text-red-600">{saveMutation.error.message}</p>
				)}
			</Modal>

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

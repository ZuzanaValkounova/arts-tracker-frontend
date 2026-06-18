import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ResourcesGrid } from "../components/resource/ResourcesGrid";
import { ResourceForm } from "../components/resource/ResourceForm";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";

import { getResources, createResource, deleteResource } from "../api/resources";
import { useAuth } from "../contexts/AuthContext";
import { useUrlFilters } from "../hooks/useUrlFilters";

// global resources view — all of the user's images and links incl. ones not tied to a project
const ResourcesPage = () => {
	const [token] = useAuth();
	const queryClient = useQueryClient();

	const { get, set: updateParams } = useUrlFilters();
	const type = get("type");
	const search = get("search");

	const [formOpen, setFormOpen] = useState(false);
	const [resourceToDelete, setResourceToDelete] = useState(null);

	const resourcesQuery = useQuery({
		queryKey: ["resources", { type, search }],
		queryFn: () => getResources(token, { type: type || undefined, search: search || undefined }),
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["resources"] });

	const createMutation = useMutation({
		mutationFn: (values) => createResource(token, values),
		onSuccess: () => {
			invalidate();
			setFormOpen(false);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (resourceId) => deleteResource(token, resourceId),
		onSuccess: invalidate,
	});

	if (resourcesQuery.isLoading) return <LoadingState />;
	if (resourcesQuery.isError)
		return <ErrorState message={resourcesQuery.error.message} onRetry={resourcesQuery.refetch} />;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">Resources</h1>
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
					+ Add
				</button>
			</div>

			<div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-3">
				<input
					type="search"
					value={search}
					onChange={(e) => updateParams({ search: e.target.value })}
					placeholder="Search description…"
					className="w-56 rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
				<select
					value={type}
					onChange={(e) => updateParams({ type: e.target.value })}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm">
					<option value="">Images + links</option>
					<option value="image">Images</option>
					<option value="link">Links</option>
				</select>
			</div>

			<ResourcesGrid resources={resourcesQuery.data ?? []} onDelete={setResourceToDelete} />

			<Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add resource">
				<ResourceForm
					loading={createMutation.isPending}
					onSubmit={createMutation.mutate}
					onCancel={() => setFormOpen(false)}
				/>
			</Modal>

			<ConfirmDialog
				open={Boolean(resourceToDelete)}
				title="Remove resource?"
				confirmLabel="Remove"
				destructive
				onConfirm={() => {
					deleteMutation.mutate(resourceToDelete._id);
					setResourceToDelete(null);
				}}
				onCancel={() => setResourceToDelete(null)}
			/>
		</div>
	);
};

export { ResourcesPage };

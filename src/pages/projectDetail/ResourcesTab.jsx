import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ResourcesGrid } from "../../components/resource/ResourcesGrid";
import { ResourceForm } from "../../components/resource/ResourceForm";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";

import { getResources, createResource, deleteResource } from "../../api/resources";
import { useAuth } from "../../contexts/AuthContext";

const ResourcesTab = ({ project }) => {
	const [token] = useAuth();
	const queryClient = useQueryClient();
	const projectId = project._id;

	const [formOpen, setFormOpen] = useState(false);
	const [resourceToDelete, setResourceToDelete] = useState(null);

	const resourcesQuery = useQuery({
		queryKey: ["resources", { projectId }],
		queryFn: () => getResources(token, { projectId }),
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
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
					+ Add image or link
				</button>
			</div>

			<ResourcesGrid resources={resourcesQuery.data ?? []} onDelete={setResourceToDelete} />

			<Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add resource">
				<ResourceForm
					projectId={projectId}
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

export { ResourcesTab };

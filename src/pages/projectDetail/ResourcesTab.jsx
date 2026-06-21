import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ResourcesGrid } from "../../components/resource/ResourcesGrid";
import { ResourceForm } from "../../components/resource/ResourceForm";
import { FormDialog } from "../../components/ui/shared/FormDialog";
import { ConfirmDialog } from "../../components/ui/shared/ConfirmDialog";
import { NewButton } from "../../components/ui/shared/NewButton";
import { LoadingState } from "../../components/ui/shared/LoadingState";
import { ErrorState } from "../../components/ui/shared/ErrorState";

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
			toast.success("Resource added");
			invalidate();
			setFormOpen(false);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (resourceId) => deleteResource(token, resourceId),
		onSuccess: () => {
			toast.success("Resource removed");
			invalidate();
		},
	});

	if (resourcesQuery.isLoading) return <LoadingState />;
	if (resourcesQuery.isError)
		return <ErrorState message={resourcesQuery.error.message} onRetry={resourcesQuery.refetch} />;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<NewButton label="New resource" onClick={() => setFormOpen(true)} />
			</div>

			<ResourcesGrid resources={resourcesQuery.data ?? []} onDelete={setResourceToDelete} />

			<FormDialog open={formOpen} onClose={() => setFormOpen(false)} title="New resource">
				<ResourceForm
					projectId={projectId}
					loading={createMutation.isPending}
					onSubmit={createMutation.mutate}
					onCancel={() => setFormOpen(false)}
				/>
			</FormDialog>

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

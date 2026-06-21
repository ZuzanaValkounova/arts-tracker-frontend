import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";

import { ResourcesGrid } from "../components/resource/ResourcesGrid";
import { ResourceForm } from "../components/resource/ResourceForm";
import { FormDialog } from "../components/ui/shared/FormDialog";
import { ConfirmDialog } from "../components/ui/shared/ConfirmDialog";
import { NewButton } from "../components/ui/shared/NewButton";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold">Resources</h1>
				<NewButton label="New resource" onClick={() => setFormOpen(true)} />
			</div>

			<div className="flex flex-wrap gap-3 rounded-lg border bg-card p-3">
				<div className="relative w-56">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						value={search}
						onChange={(e) => updateParams({ search: e.target.value })}
						placeholder="Search description…"
						className="pl-8"
					/>
				</div>
				<Select
					value={type || "all"}
					onValueChange={(next) => updateParams({ type: next === "all" ? null : next })}>
					<SelectTrigger className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={"all"}>Images + links</SelectItem>
						<SelectItem value="image">Images</SelectItem>
						<SelectItem value="link">Links</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<ResourcesGrid resources={resourcesQuery.data ?? []} onDelete={setResourceToDelete} />

			<FormDialog open={formOpen} onClose={() => setFormOpen(false)} title="New resource">
				<ResourceForm
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

export { ResourcesPage };

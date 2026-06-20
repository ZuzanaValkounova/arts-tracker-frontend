import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { MaterialsPanel } from "../../components/inventory/MaterialsPanel";
import { AddMaterialDialog } from "../../components/inventory/AddMaterialDialog";
import { LoadingState } from "../../components/ui/shared/LoadingState";
import { ErrorState } from "../../components/ui/shared/ErrorState";

import {
	getProjectMaterials,
	createProjectMaterial,
	updateProjectMaterial,
	removeProjectMaterial,
} from "../../api/projects";
import { getInventoryItems } from "../../api/inventory";
import { useAuth } from "../../contexts/AuthContext";

const MaterialsTab = ({ project }) => {
	const [token] = useAuth();
	const queryClient = useQueryClient();
	const projectId = project._id;

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editedMaterial, setEditedMaterial] = useState(null);

	const materialsQuery = useQuery({
		queryKey: ["materials", projectId],
		queryFn: () => getProjectMaterials(token, projectId),
	});

	// offers inventory filtered by project's category
	const inventoryQuery = useQuery({
		queryKey: ["inventory", { categoryId: project.categoryId }],
		queryFn: () => getInventoryItems(token, { categoryId: project.categoryId ?? undefined }),
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["materials", projectId] });

	const saveMutation = useMutation({
		mutationFn: (values) =>
			editedMaterial
				? updateProjectMaterial(token, projectId, editedMaterial._id, values)
				: createProjectMaterial(token, projectId, values),
		onSuccess: () => {
			invalidate();
			closeDialog();
		},
	});

	const removeMutation = useMutation({
		mutationFn: (materialId) => removeProjectMaterial(token, projectId, materialId),
		onSuccess: invalidate,
	});

	const closeDialog = () => {
		setDialogOpen(false);
		setEditedMaterial(null);
	};

	if (materialsQuery.isLoading) return <LoadingState />;
	if (materialsQuery.isError)
		return <ErrorState message={materialsQuery.error.message} onRetry={materialsQuery.refetch} />;

	const { items = [], totals = { estimated: 0, actual: 0 } } = materialsQuery.data ?? {};

	return (
		<>
			<MaterialsPanel
				materials={items}
				totals={totals}
				onAdd={() => setDialogOpen(true)}
				onEdit={(material) => {
					setEditedMaterial(material);
					setDialogOpen(true);
				}}
				onRemove={(material) => removeMutation.mutate(material._id)}
			/>

			<AddMaterialDialog
				key={editedMaterial?._id ?? "new"}
				open={dialogOpen}
				inventory={inventoryQuery.data ?? []}
				initialValues={
					editedMaterial
						? {
								inventoryItemId: editedMaterial.inventoryItem?._id,
								quantity: editedMaterial.quantity,
								actualCost: editedMaterial.actualCost,
							}
						: undefined
				}
				loading={saveMutation.isPending}
				onSubmit={saveMutation.mutate}
				onClose={closeDialog}
			/>
		</>
	);
};

export { MaterialsTab };

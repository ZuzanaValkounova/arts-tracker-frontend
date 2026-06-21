import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { TagChip } from "../ui/shared/TagChip";
import { FormDialog } from "../ui/shared/FormDialog";
import { ConfirmDialog } from "../ui/shared/ConfirmDialog";
import { NewButton } from "../ui/shared/NewButton";
import { EmptyState } from "../ui/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { TagForm } from "./TagForm";

const TagManager = ({ tags, onCreate, onUpdate, onDelete, mutationError }) => {
	const [formOpen, setFormOpen] = useState(false);
	const [editedTag, setEditedTag] = useState(null);
	const [tagToDelete, setTagToDelete] = useState(null);

	const closeForm = () => {
		setFormOpen(false);
		setEditedTag(null);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold">Your tags</h2>
				<NewButton label="New tag" size="sm" onClick={() => setFormOpen(true)} />
			</div>

			{tags.length === 0 ? (
				<EmptyState message="No tags yet. Create one to start labeling projects." />
			) : (
				<div className="flex flex-col gap-1 rounded-lg border bg-card p-2">
					{tags.map((tag) => (
						<div
							key={tag._id}
							className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted">
							<TagChip tag={tag} />
							<div className="flex gap-1">
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Edit tag ${tag.name}`}
									onClick={() => {
										setEditedTag(tag);
										setFormOpen(true);
									}}>
									<Pencil />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Delete tag ${tag.name}`}
									onClick={() => setTagToDelete(tag)}>
									<Trash2 />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			<FormDialog
				open={formOpen}
				onClose={closeForm}
				title={editedTag ? "Edit tag" : "New tag"}
				className="sm:max-w-md">
				<TagForm
					key={editedTag?._id ?? "new"}
					initialValues={editedTag ?? undefined}
					error={mutationError}
					onSubmit={(values) => {
						if (editedTag) onUpdate(editedTag._id, values);
						else onCreate(values);
						closeForm();
					}}
					onCancel={closeForm}
				/>
			</FormDialog>

			<ConfirmDialog
				open={Boolean(tagToDelete)}
				title={`Delete tag "${tagToDelete?.name}"?`}
				description="The tag will also be removed from all projects that use it."
				confirmLabel="Delete"
				destructive
				onConfirm={() => {
					onDelete(tagToDelete._id);
					setTagToDelete(null);
				}}
				onCancel={() => setTagToDelete(null)}
			/>
		</div>
	);
};

export { TagManager };

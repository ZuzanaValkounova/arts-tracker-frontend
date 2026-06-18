import { useState } from "react";

import { TagChip } from "../ui/TagChip";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { EmptyState } from "../ui/EmptyState";
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
				<button
					type="button"
					onClick={() => setFormOpen(true)}
					className="rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700">
					+ New tag
				</button>
			</div>

			{tags.length === 0 ? (
				<EmptyState message="No tags yet. Create one to start labeling projects." />
			) : (
				<div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2">
					{tags.map((tag) => (
						<div
							key={tag._id}
							className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-gray-50">
							<TagChip tag={tag} />
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => {
										setEditedTag(tag);
										setFormOpen(true);
									}}
									className="text-xs text-gray-500 hover:text-gray-800">
									Edit
								</button>
								<button
									type="button"
									onClick={() => setTagToDelete(tag)}
									className="text-xs text-red-500 hover:text-red-700">
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<Modal
				open={formOpen}
				onClose={closeForm}
				title={editedTag ? "Edit tag" : "New tag"}
				widthClass="max-w-md">
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
			</Modal>

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

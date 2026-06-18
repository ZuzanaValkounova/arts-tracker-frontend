import { Modal } from "./Modal";

// used with destructive=true for cascading deletes the backend warns about:
// project (deletes tasks + moodboard + resources), tag (removed from projects),
// inventory item (removed from project materials)
const ConfirmDialog = ({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	destructive = false,
	onConfirm,
	onCancel,
}) => {
	return (
		<Modal open={open} onClose={onCancel} title={title} widthClass="max-w-md">
			{description && <p className="mb-4 text-sm text-gray-600">{description}</p>}
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className={`rounded px-3 py-1.5 text-sm text-white ${
						destructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
					}`}>
					{confirmLabel}
				</button>
			</div>
		</Modal>
	);
};

export { ConfirmDialog };

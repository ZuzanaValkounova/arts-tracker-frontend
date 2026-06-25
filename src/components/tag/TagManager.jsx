import { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";

import { TagChip } from "../ui/shared/TagChip";
import { FormDialog } from "../ui/shared/FormDialog";
import { ConfirmDialog } from "../ui/shared/ConfirmDialog";
import { NewButton } from "../ui/shared/NewButton";
import { EmptyState } from "../ui/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagForm } from "./TagForm";

const TagManager = ({ tags, onCreate, onUpdate, onDelete, mutationError }) => {
	const [formOpen, setFormOpen] = useState(false);
	const [editedTag, setEditedTag] = useState(null);
	const [tagToDelete, setTagToDelete] = useState(null);
	const [search, setSearch] = useState("");

	const closeForm = () => {
		setFormOpen(false);
		setEditedTag(null);
	};

	const filteredTags = tags.filter((tag) =>
		tag.name.toLowerCase().includes(search.trim().toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-semibold">Your tags</h2>
				<NewButton label="New tag" size="sm" onClick={() => setFormOpen(true)} />
			</div>

			{tags.length > 0 && (
				<div className="relative w-full max-w-xs">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search tags…"
						className="pl-8"
					/>
				</div>
			)}

			{tags.length === 0 ? (
				<EmptyState message="No tags yet. Create one to start labeling projects." />
			) : filteredTags.length === 0 ? (
				<EmptyState message="No tags match your search." />
			) : (
				<div className="flex flex-col gap-1 rounded-lg border bg-card p-2">
					{filteredTags.map((tag) => (
						<div
							key={tag._id}
							className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-muted">
							<TagChip tag={tag} size="md" />
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
									className="text-destructive hover:text-destructive"
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

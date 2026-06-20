import { useState } from "react";
import { z } from "zod";

import { PROJECT_STATUSES, STATUS_META } from "../../utils/constants";
import { CategoryPicker } from "../ui/shared/CategoryPicker";
import { TagPicker } from "../ui/shared/TagPicker";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { ColorPicker } from "../ui/shared/ColorPicker";
import { ImageUpload } from "../ui/shared/ImageUpload";
import { DateField } from "../ui/shared/DateField";

const projectSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	description: z.string().max(5000).optional(),
	categoryId: z.string().nullable().optional(),
	tagIds: z.array(z.string()),
	difficulty: z.number().int().min(1).max(5).nullable().optional(),
	status: z.enum(PROJECT_STATUSES),
	color: z
		.string()
		.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color")
		.nullable()
		.optional(),
	deadline: z.string().nullable().optional(),
});

const ProjectForm = ({
	initialValues,
	categories = [],
	tags = [],
	onSubmit,
	onCancel,
	onCreateTag,
	loading,
}) => {
	const [values, setValues] = useState({
		name: initialValues?.name ?? "",
		description: initialValues?.description ?? "",
		categoryId: initialValues?.categoryId ?? null,
		tagIds: initialValues?.tagIds ?? [],
		difficulty: initialValues?.difficulty ?? null,
		status: initialValues?.status ?? "planned",
		color: initialValues?.color ?? null,
		deadline: initialValues?.deadline ?? null,
	});
	const [imageFile, setImageFile] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [removeImage, setRemoveImage] = useState(false);
	const [errors, setErrors] = useState({});

	const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));

	const handleSubmit = (e) => {
		e.preventDefault();
		const result = projectSchema.safeParse(values);
		if (!result.success) {
			setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message])));
			return;
		}
		setErrors({});

		// drop empty optional fields so PATCH/POST only sends what is set
		const payload = Object.fromEntries(
			Object.entries(result.data).filter(([, v]) => v !== null && v !== "" && v !== undefined),
		);
		payload.tagIds = result.data.tagIds;
		if (imageFile) payload.imageFile = imageFile;
		else if (imageUrl) payload.imageUrl = imageUrl;
		else if (removeImage) payload.removeImage = true;

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Name *</span>
				<input
					type="text"
					value={values.name}
					onChange={(e) => set({ name: e.target.value })}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
				{errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
			</label>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Description</span>
				<textarea
					value={values.description}
					onChange={(e) => set({ description: e.target.value })}
					rows={3}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
			</label>

			<div className="flex flex-wrap items-end gap-4">
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Category</span>
					<CategoryPicker
						value={values.categoryId}
						options={categories}
						onChange={(id) => set({ categoryId: id })}
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Status</span>
					<select
						value={values.status}
						onChange={(e) => set({ status: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						{PROJECT_STATUSES.map((status) => (
							<option key={status} value={status}>
								{STATUS_META[status].label}
							</option>
						))}
					</select>
				</label>
				<DateField
					label="Deadline"
					value={values.deadline}
					onChange={(date) => set({ deadline: date })}
				/>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Difficulty</span>
					<DifficultyRating
						value={values.difficulty ?? 0}
						onChange={(difficulty) => set({ difficulty })}
					/>
				</label>
			</div>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Tags</span>
				<TagPicker
					value={values.tagIds}
					options={tags}
					onChange={(tagIds) => set({ tagIds })}
					onCreate={onCreateTag}
				/>
			</label>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Color</span>
				<ColorPicker value={values.color} onChange={(color) => set({ color })} />
			</label>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Cover image</span>
				<ImageUpload
					value={removeImage ? null : (initialValues?.image?.url ?? null)}
					onSelect={(file) => {
						setImageFile(file);
						setRemoveImage(false);
					}}
					onSelectUrl={(url) => {
						setImageUrl(url);
						setRemoveImage(false);
					}}
					onRemove={() => {
						setImageFile(null);
						setImageUrl(null);
						setRemoveImage(true);
					}}
				/>
			</label>

			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onCancel}
					className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving…" : initialValues ? "Save changes" : "Create project"}
				</button>
			</div>
		</form>
	);
};

export { ProjectForm };

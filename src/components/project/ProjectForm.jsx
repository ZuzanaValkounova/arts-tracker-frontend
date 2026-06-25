import { useState } from "react";
import { z } from "zod";

import { PROJECT_STATUSES, STATUS_META } from "../../utils/constants";
import { CategoryPicker } from "../ui/shared/CategoryPicker";
import { TagPicker } from "../ui/shared/TagPicker";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { ColorPicker } from "../ui/shared/ColorPicker";
import { ImageUpload } from "../ui/shared/ImageUpload";
import { DateField } from "../ui/shared/DateField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
			<div className="flex flex-col gap-1.5">
				<Label>
					Name <span className="text-destructive">*</span>
				</Label>
				<Input value={values.name} onChange={(e) => set({ name: e.target.value })} />
				{errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Description</Label>
				<Textarea
					value={values.description}
					onChange={(e) => set({ description: e.target.value })}
					rows={3}
				/>
			</div>

			<div className="flex flex-wrap items-end gap-4">
				<div className="flex flex-col gap-1.5">
					<Label>Category</Label>
					<CategoryPicker
						value={values.categoryId}
						options={categories}
						onChange={(id) => set({ categoryId: id })}
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Status</Label>
					<Select value={values.status} onValueChange={(status) => set({ status })}>
						<SelectTrigger className="w-44">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PROJECT_STATUSES.map((status) => (
								<SelectItem key={status} value={status}>
									{STATUS_META[status].label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DateField
					label="Deadline"
					value={values.deadline}
					onChange={(date) => set({ deadline: date })}
				/>
				<div className="flex flex-col gap-1.5">
					<Label>Difficulty</Label>
					<DifficultyRating
						value={values.difficulty ?? 0}
						onChange={(difficulty) => set({ difficulty })}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Tags</Label>
				<TagPicker
					value={values.tagIds}
					options={tags}
					onChange={(tagIds) => set({ tagIds })}
					onCreate={onCreateTag}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Color</Label>
				<ColorPicker value={values.color} onChange={(color) => set({ color })} />
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Cover image</Label>
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
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? "Saving…" : initialValues ? "Save changes" : "Create project"}
				</Button>
			</div>
		</form>
	);
};

export { ProjectForm };

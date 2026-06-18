import { useState } from "react";
import { z } from "zod";

import { INVENTORY_TYPES, INVENTORY_STATUSES } from "../../utils/constants";
import { ImageUpload } from "../ui/ImageUpload";

// mirrors backend validators/inventoryItemValidator.js
const inventoryItemSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	description: z.string().max(2000).optional(),
	type: z.enum(INVENTORY_TYPES).default("consumable"),
	status: z.enum(INVENTORY_STATUSES),
	quantity: z.number().int().min(0).default(1),
	price: z.number().min(0).nullable().optional(),
	currency: z
		.string()
		.length(3, "Use a 3-letter ISO code (CZK, EUR…)")
		.transform((v) => v.toUpperCase()),
	source: z.union([z.url("Must be a valid URL"), z.literal("")]).optional(),
	categoryIds: z.array(z.string()),
});

const InventoryForm = ({ initialValues, categories = [], onSubmit, onCancel, loading }) => {
	const [values, setValues] = useState({
		name: initialValues?.name ?? "",
		description: initialValues?.description ?? "",
		type: initialValues?.type ?? "consumable",
		status: initialValues?.status ?? "wishlist",
		quantity: initialValues?.quantity ?? 1,
		price: initialValues?.price ?? null,
		currency: initialValues?.currency ?? "CZK",
		source: initialValues?.source ?? "",
		categoryIds: initialValues?.categoryIds ?? [],
	});
	const [imageFile, setImageFile] = useState(null);
	const [removeImage, setRemoveImage] = useState(false);
	const [errors, setErrors] = useState({});

	const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));

	const toggleCategory = (categoryId) => {
		set({
			categoryIds: values.categoryIds.includes(categoryId)
				? values.categoryIds.filter((id) => id !== categoryId)
				: [...values.categoryIds, categoryId],
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const result = inventoryItemSchema.safeParse(values);
		if (!result.success) {
			setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message])));
			return;
		}
		setErrors({});

		const payload = { ...result.data };
		if (!payload.source) delete payload.source;
		if (!payload.description) delete payload.description;
		if (payload.price == null) delete payload.price;
		if (imageFile) payload.imageFile = imageFile;
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
					rows={2}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
			</label>

			<div className="flex flex-wrap items-end gap-4">
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Type</span>
					<select
						value={values.type}
						onChange={(e) => set({ type: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="consumable">Consumable</option>
						<option value="tool">Tool</option>
					</select>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Status</span>
					<select
						value={values.status}
						onChange={(e) => set({ status: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="wishlist">Wishlist</option>
						<option value="owned">Owned</option>
					</select>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Quantity</span>
					<input
						type="number"
						min={0}
						value={values.quantity}
						onChange={(e) => set({ quantity: Number(e.target.value) })}
						className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Price</span>
					<input
						type="number"
						min={0}
						step="0.01"
						value={values.price ?? ""}
						onChange={(e) => set({ price: e.target.value === "" ? null : Number(e.target.value) })}
						className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Currency</span>
					<input
						type="text"
						maxLength={3}
						value={values.currency}
						onChange={(e) => set({ currency: e.target.value.toUpperCase() })}
						className="w-16 rounded border border-gray-300 px-2 py-1.5 text-sm uppercase"
					/>
					{errors.currency && <span className="text-xs text-red-600">{errors.currency}</span>}
				</label>
			</div>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Source URL</span>
				<input
					type="url"
					value={values.source}
					onChange={(e) => set({ source: e.target.value })}
					placeholder="https://…"
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
				{errors.source && <span className="text-xs text-red-600">{errors.source}</span>}
			</label>

			<div className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Categories</span>
				<div className="flex flex-wrap gap-1.5">
					{categories.map((category) => (
						<button
							key={category._id}
							type="button"
							onClick={() => toggleCategory(category._id)}
							className={`rounded-full border px-2.5 py-0.5 text-xs ${
								values.categoryIds.includes(category._id)
									? "border-blue-400 bg-blue-50 text-blue-700"
									: "border-gray-300 text-gray-500 hover:border-gray-400"
							}`}>
							{category.icon} {category.name}
						</button>
					))}
				</div>
			</div>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Image</span>
				<ImageUpload
					value={removeImage ? null : (initialValues?.image?.url ?? null)}
					onSelect={(file) => {
						setImageFile(file);
						setRemoveImage(false);
					}}
					onRemove={() => {
						setImageFile(null);
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
					{loading ? "Saving…" : initialValues ? "Save changes" : "Add item"}
				</button>
			</div>
		</form>
	);
};

export { InventoryForm };

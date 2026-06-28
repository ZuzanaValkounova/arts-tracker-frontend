import { useState } from "react";
import { z } from "zod";
import { ChevronRight } from "lucide-react";

import { INVENTORY_TYPES, INVENTORY_STATUSES } from "../../utils/constants";
import { ImageUpload } from "../ui/shared/ImageUpload";
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
import { cn } from "@/lib/utils";
import { CategoryIcon } from "../ui/shared/CategoryIcon";

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
		currency: "CZK", // system is single-currency (CZK) for now
		source: initialValues?.source ?? "",
		categoryIds: initialValues?.categoryIds ?? [],
	});
	const [imageFile, setImageFile] = useState(null);
	const [removeImage, setRemoveImage] = useState(false);
	const [errors, setErrors] = useState({});
	const [showMore, setShowMore] = useState(Boolean(initialValues));

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
			<div className="flex flex-col gap-1.5">
				<Label>
					Name <span className="text-destructive">*</span>
				</Label>
				<Input value={values.name} onChange={(e) => set({ name: e.target.value })} />
				{errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
			</div>

			<div className="flex flex-wrap items-end gap-4">
				<div className="flex flex-col gap-1.5">
					<Label>Type</Label>
					<Select value={values.type} onValueChange={(type) => set({ type })}>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="consumable">Consumable</SelectItem>
							<SelectItem value="tool">Tool</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Status</Label>
					<Select value={values.status} onValueChange={(status) => set({ status })}>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="wishlist">Wishlist</SelectItem>
							<SelectItem value="owned">Owned</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Quantity</Label>
					<Input
						type="number"
						min={0}
						value={values.quantity}
						onChange={(e) => set({ quantity: Number(e.target.value) })}
						className="w-20"
					/>
				</div>
			</div>

			<button
				type="button"
				onClick={() => setShowMore((open) => !open)}
				aria-expanded={showMore}
				className="-my-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
				<ChevronRight className={cn("size-4 transition-transform", showMore && "rotate-90")} />
				More options
			</button>

			{showMore && (
				<div className="flex flex-col gap-4 border-l border-border/60 pl-3">
					<div className="flex flex-col gap-1.5">
						<Label>Description</Label>
						<Textarea
							value={values.description}
							onChange={(e) => set({ description: e.target.value })}
							rows={2}
						/>
					</div>

					<div className="flex flex-wrap items-end gap-4">
						<div className="flex flex-col gap-1.5">
							<Label>Price</Label>
							<Input
								type="number"
								min={0}
								step="0.01"
								value={values.price ?? ""}
								onChange={(e) =>
									set({ price: e.target.value === "" ? null : Number(e.target.value) })
								}
								className="w-24"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label>Currency</Label>
							<Input
								value="CZK"
								disabled
								readOnly
								title="Only CZK is supported for now"
								className="w-16 uppercase"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Source URL</Label>
						<Input
							type="url"
							value={values.source}
							onChange={(e) => set({ source: e.target.value })}
							placeholder="https://…"
						/>
						{errors.source && <span className="text-xs text-destructive">{errors.source}</span>}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Categories</Label>
						<div className="flex flex-wrap gap-1.5">
							{categories.map((category) => (
								<button
									key={category._id}
									type="button"
									onClick={() => toggleCategory(category._id)}
									className={cn(
										"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors",
										values.categoryIds.includes(category._id)
											? "border-primary bg-primary/10 text-foreground"
											: "border-border text-muted-foreground hover:border-ring",
									)}>
									<CategoryIcon name={category.icon} className="size-3.5" />
									{category.name}
								</button>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Image</Label>
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
					</div>
				</div>
			)}

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? "Saving…" : initialValues ? "Save changes" : "Add item"}
				</Button>
			</div>
		</form>
	);
};

export { InventoryForm };

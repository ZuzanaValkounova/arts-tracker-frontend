import { useState } from "react";
import { ImageIcon, Link as LinkIcon } from "lucide-react";

import { ImageUpload } from "../ui/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// type=link -> url required; type=image -> file (multipart) or imageUrl
const ResourceForm = ({ initialValues, projectId, onSubmit, onCancel, loading }) => {
	const [type, setType] = useState(initialValues?.type ?? "image");
	const [url, setUrl] = useState(initialValues?.type === "link" ? initialValues.url : "");
	const [description, setDescription] = useState(initialValues?.description ?? "");
	const [imageFile, setImageFile] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const canSubmit =
		type === "link" ? Boolean(url) : Boolean(imageFile || imageUrl || initialValues);

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = { type, description: description || undefined };
		if (projectId) payload.projectId = projectId;
		if (type === "link") {
			payload.url = url;
		} else if (imageFile) {
			payload.imageFile = imageFile;
		} else if (imageUrl) {
			payload.imageUrl = imageUrl;
		}
		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<ToggleGroup
				type="single"
				variant="outline"
				value={type}
				onValueChange={(next) => next && setType(next)}
				className="self-start">
				<ToggleGroupItem value="image" className="px-3">
					<ImageIcon /> Image
				</ToggleGroupItem>
				<ToggleGroupItem value="link" className="px-3">
					<LinkIcon /> Link
				</ToggleGroupItem>
			</ToggleGroup>

			{type === "link" ? (
				<div className="flex flex-col gap-1.5">
					<Label>
						URL <span className="text-destructive">*</span>
					</Label>
					<Input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://…"
					/>
				</div>
			) : (
				<ImageUpload
					value={initialValues?.type === "image" ? initialValues.url : null}
					onSelect={setImageFile}
					onSelectUrl={setImageUrl}
				/>
			)}

			<div className="flex flex-col gap-1.5">
				<Label>Description</Label>
				<Input value={description} onChange={(e) => setDescription(e.target.value)} />
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={!canSubmit || loading}>
					{loading ? "Saving…" : initialValues ? "Save" : "Add"}
				</Button>
			</div>
		</form>
	);
};

export { ResourceForm };

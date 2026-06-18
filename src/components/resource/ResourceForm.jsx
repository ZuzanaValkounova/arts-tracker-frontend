import { useState } from "react";
import { ImageUpload } from "../ui/ImageUpload";

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
			<div className="flex gap-1 self-start rounded-lg border border-gray-300 p-0.5">
				{["image", "link"].map((option) => (
					<button
						key={option}
						type="button"
						onClick={() => setType(option)}
						className={`rounded-md px-3 py-1 text-sm ${
							type === option ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
						}`}>
						{option === "image" ? "🖼️ Image" : "🔗 Link"}
					</button>
				))}
			</div>

			{type === "link" ? (
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">URL *</span>
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://…"
						className="rounded border border-gray-300 px-2 py-1.5 text-sm"
					/>
				</label>
			) : (
				<ImageUpload
					value={initialValues?.type === "image" ? initialValues.url : null}
					onSelect={setImageFile}
					onSelectUrl={setImageUrl}
				/>
			)}

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Description</span>
				<input
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
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
					disabled={!canSubmit || loading}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving…" : initialValues ? "Save" : "Add"}
				</button>
			</div>
		</form>
	);
};

export { ResourceForm };

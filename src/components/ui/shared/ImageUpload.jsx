import { useRef, useState } from "react";

const ImageUpload = ({ value, onSelect, onRemove, onSelectUrl, accept = "image/*" }) => {
	const inputRef = useRef(null);
	const [dragOver, setDragOver] = useState(false);
	const [localPreview, setLocalPreview] = useState(null);
	const [urlInput, setUrlInput] = useState("");

	const preview = localPreview ?? value;

	const pickFile = (file) => {
		if (!file || !file.type.startsWith("image/")) return;
		setLocalPreview(URL.createObjectURL(file));
		onSelect(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		pickFile(e.dataTransfer.files?.[0]);
	};

	const handleRemove = () => {
		setLocalPreview(null);
		if (inputRef.current) inputRef.current.value = "";
		onRemove?.();
	};

	return (
		<div className="flex flex-col gap-2">
			<div
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={handleDrop}
				className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-3 text-sm text-gray-500 ${
					dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
				}`}>
				{preview ? (
					<img src={preview} alt="Preview" className="max-h-40 rounded object-contain" />
				) : (
					<>
						<span>Drop an image here or click to browse</span>
						<span className="text-xs text-gray-400">{accept}</span>
					</>
				)}
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					className="hidden"
					onChange={(e) => pickFile(e.target.files?.[0])}
				/>
			</div>
			{onSelectUrl && (
				<div className="flex gap-2">
					<input
						type="url"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						placeholder="...or paste an image URL"
						className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					/>
					<button
						type="button"
						disabled={!urlInput}
						onClick={() => {
							setLocalPreview(urlInput);
							onSelectUrl(urlInput);
							setUrlInput("");
						}}
						className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50">
						Use URL
					</button>
				</div>
			)}
			{(preview || value) && onRemove && (
				<button
					type="button"
					onClick={handleRemove}
					className="self-start text-xs text-red-500 hover:text-red-700">
					Remove image
				</button>
			)}
		</div>
	);
};

export { ImageUpload };

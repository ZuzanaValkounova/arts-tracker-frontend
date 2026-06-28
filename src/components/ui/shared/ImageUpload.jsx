import { useRef, useState } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ImageUpload = ({
	value,
	onSelect,
	onRemove,
	onSelectUrl,
	accept = "image/jpeg,image/png,image/webp",
	uploading = false,
}) => {
	const inputRef = useRef(null);
	const [dragOver, setDragOver] = useState(false);
	const [localPreview, setLocalPreview] = useState(null);
	const [urlInput, setUrlInput] = useState("");

	const preview = localPreview ?? value;

	const acceptedTypes = accept.split(",").map((type) => type.trim());
	const isAccepted = (file) =>
		acceptedTypes.some((type) =>
			type === "image/*" ? file.type.startsWith("image/") : type === file.type,
		);

	const pickFile = (file) => {
		if (!file || !isAccepted(file)) return;
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
				onClick={() => !uploading && inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					if (!uploading) setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={(e) => !uploading && handleDrop(e)}
				className={cn(
					"relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-3 text-sm text-muted-foreground transition-colors",
					dragOver ? "border-ring bg-accent" : "border-input hover:border-ring",
					uploading && "cursor-default",
				)}>
				{uploading && (
					<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-md bg-background/70 backdrop-blur-sm">
						<Loader2 className="size-5 animate-spin text-foreground" />
						<span className="text-xs font-medium text-foreground">Uploading…</span>
					</div>
				)}
				{preview ? (
					<img src={preview} alt="Preview" className="max-h-40 rounded object-contain" />
				) : (
					<>
						<Upload className="size-5" />
						<span>Drop an image here or click to browse</span>
						<span className="text-xs text-muted-foreground/70">
							{acceptedTypes
								.map((type) => type.replace("image/", "").replace("jpeg", "jpg").toUpperCase())
								.join(", ")}
						</span>
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
					<Input
						type="url"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						placeholder="...or paste an image URL"
						className="h-7 flex-1"
					/>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={!urlInput}
						onClick={() => {
							setLocalPreview(urlInput);
							onSelectUrl(urlInput);
							setUrlInput("");
						}}>
						Use URL
					</Button>
				</div>
			)}
			{(preview || value) && onRemove && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="self-start text-destructive hover:text-destructive"
					onClick={handleRemove}>
					<Trash2 />
					Remove image
				</Button>
			)}
		</div>
	);
};

export { ImageUpload };

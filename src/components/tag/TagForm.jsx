import { useState } from "react";
import { ColorPicker } from "../ui/ColorPicker";

const TagForm = ({ initialValues, onSubmit, onCancel, loading, error }) => {
	const [name, setName] = useState(initialValues?.name ?? "");
	const [color, setColor] = useState(initialValues?.color ?? null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name: name.trim(), color });
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Name *</span>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={100}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Color</span>
				<ColorPicker value={color} onChange={setColor} />
			</label>
			{error && <p className="text-xs text-red-600">{error}</p>}
			<div className="flex justify-end gap-2 pt-1">
				<button
					type="button"
					onClick={onCancel}
					className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
					Cancel
				</button>
				<button
					type="submit"
					disabled={!name.trim() || loading}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving…" : initialValues ? "Save" : "Create tag"}
				</button>
			</div>
		</form>
	);
};

export { TagForm };

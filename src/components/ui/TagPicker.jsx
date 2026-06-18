import { useState } from "react";
import { TagChip } from "./TagChip";
import { ColorPicker } from "./ColorPicker";

// value: array of tagIds, options: available tags [{ _id, name, color }]
const TagPicker = ({ value = [], options = [], onChange, onCreate }) => {
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState("");
	const [newColor, setNewColor] = useState(null);

	const toggleTag = (tagId) => {
		onChange(value.includes(tagId) ? value.filter((id) => id !== tagId) : [...value, tagId]);
	};

	const handleCreate = () => {
		if (!newName.trim()) return;
		onCreate(newName.trim(), newColor);
		setNewName("");
		setNewColor(null);
		setCreating(false);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center gap-1.5">
				{options.map((tag) => (
					<TagChip
						key={tag._id}
						tag={tag}
						selected={value.includes(tag._id)}
						onClick={() => toggleTag(tag._id)}
					/>
				))}
				{onCreate && !creating && (
					<button
						type="button"
						onClick={() => setCreating(true)}
						className="rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-xs text-gray-500 hover:border-gray-500">
						+ New tag
					</button>
				)}
			</div>
			{creating && (
				<div className="flex flex-wrap items-center gap-2 rounded border border-gray-200 p-2">
					<input
						type="text"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="Tag name"
						className="rounded border border-gray-300 px-2 py-1 text-xs"
					/>
					<ColorPicker value={newColor} onChange={setNewColor} />
					<button
						type="button"
						onClick={handleCreate}
						disabled={!newName.trim()}
						className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50">
						Create
					</button>
					<button
						type="button"
						onClick={() => setCreating(false)}
						className="text-xs text-gray-500">
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};

export { TagPicker };

import { useState } from "react";
import { Plus } from "lucide-react";

import { TagChip } from "./TagChip";
import { ColorPicker } from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
						className="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground">
						<Plus className="size-3" />
						New tag
					</button>
				)}
			</div>
			{creating && (
				<div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="Tag name"
						className="h-7 w-40"
					/>
					<ColorPicker value={newColor} onChange={setNewColor} />
					<Button type="button" size="sm" onClick={handleCreate} disabled={!newName.trim()}>
						Create
					</Button>
					<Button type="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
};

export { TagPicker };

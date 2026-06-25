import { useState } from "react";
import { ColorPicker } from "../ui/shared/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
			<div className="flex flex-col gap-1.5">
				<Label>
					Name <span className="text-destructive">*</span>
				</Label>
				<Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label>Color</Label>
				<ColorPicker value={color} onChange={setColor} />
			</div>
			{error && <p className="text-xs text-destructive">{error}</p>}
			<div className="flex justify-end gap-2 pt-1">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={!name.trim() || loading}>
					{" "}
					{loading ? "Saving…" : initialValues ? "Save" : "Create tag"}
				</Button>
			</div>
		</form>
	);
};

export { TagForm };

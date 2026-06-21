import { useState } from "react";
import { FormDialog } from "../ui/shared/FormDialog";
import { DifficultyRating } from "../ui/shared/DifficultyRating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ReflectionDialog = ({ open, initialValues, onSubmit, onClose, loading }) => {
	const [values, setValues] = useState({
		whatWorked: initialValues?.whatWorked ?? "",
		whatDidntWork: initialValues?.whatDidntWork ?? "",
		whatToImprove: initialValues?.whatToImprove ?? "",
		difficulty: initialValues?.difficulty ?? null,
	});

	const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(values);
	};

	const fields = [
		{ key: "whatWorked", label: "What worked well?" },
		{ key: "whatDidntWork", label: "What didn't work?" },
		{ key: "whatToImprove", label: "What to improve next time?" },
	];

	return (
		<FormDialog open={open} onClose={onClose} title="Project reflection">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				{fields.map(({ key, label }) => (
					<div key={key} className="flex flex-col gap-1.5">
						<Label>{label}</Label>
						<Textarea
							value={values[key]}
							onChange={(e) => set({ [key]: e.target.value })}
							rows={3}
							maxLength={5000}
						/>
					</div>
				))}
				<div className="flex flex-col gap-1.5">
					<Label>How difficult was it in the end?</Label>
					<DifficultyRating
						value={values.difficulty ?? 0}
						onChange={(difficulty) => set({ difficulty })}
					/>
				</div>
				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Skip for now
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Saving…" : "Save reflection"}
					</Button>
				</div>
			</form>
		</FormDialog>
	);
};

export { ReflectionDialog };

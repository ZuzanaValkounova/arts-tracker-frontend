import { useState } from "react";
import { Modal } from "../ui/shared/Modal";
import { DifficultyRating } from "../ui/shared/DifficultyRating";

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
		<Modal open={open} onClose={onClose} title="Project reflection">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				{fields.map(({ key, label }) => (
					<label key={key} className="flex flex-col gap-1 text-sm">
						<span className="text-xs font-medium text-gray-600">{label}</span>
						<textarea
							value={values[key]}
							onChange={(e) => set({ [key]: e.target.value })}
							rows={3}
							maxLength={5000}
							className="rounded border border-gray-300 px-2 py-1.5 text-sm"
						/>
					</label>
				))}
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">
						How difficult was it in the end?
					</span>
					<DifficultyRating
						value={values.difficulty ?? 0}
						onChange={(difficulty) => set({ difficulty })}
					/>
				</label>
				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
						Skip for now
					</button>
					<button
						type="submit"
						disabled={loading}
						className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
						{loading ? "Saving…" : "Save reflection"}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export { ReflectionDialog };

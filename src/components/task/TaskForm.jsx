import { useState } from "react";
import { z } from "zod";

import { TASK_STATUSES, PRIORITIES, STATUS_META, PRIORITY_META } from "../../utils/constants";
import { DateField } from "../ui/DateField";

const taskSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	description: z.string().max(5000).optional(),
	status: z.enum(TASK_STATUSES).default("planned"),
	priority: z.enum(PRIORITIES).default("low"),
	deadline: z.string().nullable().optional(),
});

const TaskForm = ({
	initialValues,
	projectId,
	parentTaskId,
	parentTaskName,
	onSubmit,
	onCancel,
	loading,
}) => {
	const [values, setValues] = useState({
		name: initialValues?.name ?? "",
		description: initialValues?.description ?? "",
		status: initialValues?.status ?? "planned",
		priority: initialValues?.priority ?? "low",
		deadline: initialValues?.deadline ?? null,
	});
	const [errors, setErrors] = useState({});

	const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));

	const handleSubmit = (e) => {
		e.preventDefault();
		const result = taskSchema.safeParse(values);
		if (!result.success) {
			setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message])));
			return;
		}
		setErrors({});

		const payload = { ...result.data, projectId };
		if (!payload.deadline) delete payload.deadline;
		if (!payload.description) delete payload.description;
		if (parentTaskId) payload.parentTaskId = parentTaskId;

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{parentTaskId && (
				<p className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-500">
					Subtask of: <span className="font-medium">{parentTaskName ?? parentTaskId}</span>
				</p>
			)}

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Name *</span>
				<input
					type="text"
					value={values.name}
					onChange={(e) => set({ name: e.target.value })}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
				{errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
			</label>

			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Description</span>
				<textarea
					value={values.description}
					onChange={(e) => set({ description: e.target.value })}
					rows={3}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm"
				/>
			</label>

			<div className="flex flex-wrap items-end gap-4">
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Status</span>
					<select
						value={values.status}
						onChange={(e) => set({ status: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						{TASK_STATUSES.map((status) => (
							<option key={status} value={status}>
								{STATUS_META[status].label}
							</option>
						))}
					</select>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Priority</span>
					<select
						value={values.priority}
						onChange={(e) => set({ priority: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						{PRIORITIES.map((priority) => (
							<option key={priority} value={priority}>
								{PRIORITY_META[priority].label}
							</option>
						))}
					</select>
				</label>
				<DateField
					label="Deadline"
					value={values.deadline}
					onChange={(date) => set({ deadline: date })}
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onCancel}
					className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading}
					className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving…" : initialValues ? "Save changes" : "Create task"}
				</button>
			</div>
		</form>
	);
};

export { TaskForm };

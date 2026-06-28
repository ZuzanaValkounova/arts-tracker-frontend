import { useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronRight } from "lucide-react";

import { TASK_STATUSES, PRIORITIES, STATUS_META, PRIORITY_META } from "../../utils/constants";
import { DateField } from "../ui/shared/DateField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const taskSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	description: z.string().max(5000).optional(),
	status: z.enum(TASK_STATUSES).default("planned"),
	priority: z.enum(PRIORITIES).default("low"),
	deadline: z.string().nullable().optional(),
	startedAt: z.string().nullable().optional(),
	completedAt: z.string().nullable().optional(),
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
		startedAt: initialValues?.startedAt ?? null,
		completedAt: initialValues?.completedAt ?? null,
	});
	const [errors, setErrors] = useState({});
	const [showAdvanced, setShowAdvanced] = useState(
		Boolean(initialValues?.description || initialValues?.startedAt || initialValues?.completedAt),
	);

	const today = new Date().toISOString();
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
		// keep timestamps consistent with status
		if (payload.status === "planned") {
			delete payload.startedAt;
			delete payload.completedAt;
		} else if (payload.status !== "completed") {
			delete payload.completedAt;
		}
		if (!payload.startedAt) delete payload.startedAt;
		if (!payload.completedAt) delete payload.completedAt;
		if (parentTaskId) payload.parentTaskId = parentTaskId;

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{parentTaskId && (
				<p className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
					Subtask of:{" "}
					<span className="font-medium text-foreground">{parentTaskName ?? parentTaskId}</span>
				</p>
			)}

			<div className="flex flex-col gap-1.5">
				<Label>
					Name <span className="text-destructive">*</span>
				</Label>
				<Input value={values.name} onChange={(e) => set({ name: e.target.value })} />
				{errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
			</div>

			<div className="flex flex-wrap items-end gap-4">
				<div className="flex flex-col gap-1.5">
					<Label>Status</Label>
					<Select value={values.status} onValueChange={(status) => set({ status })}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TASK_STATUSES.map((status) => (
								<SelectItem key={status} value={status}>
									{STATUS_META[status].label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Priority</Label>
					<Select value={values.priority} onValueChange={(priority) => set({ priority })}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PRIORITIES.map((priority) => (
								<SelectItem key={priority} value={priority}>
									{PRIORITY_META[priority].label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DateField
					label="Deadline"
					value={values.deadline}
					onChange={(date) => set({ deadline: date })}
				/>
			</div>

			<button
				type="button"
				onClick={() => setShowAdvanced((open) => !open)}
				className="flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
				{showAdvanced ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
				More options
			</button>

			{showAdvanced && (
				<div className="flex flex-col gap-4 rounded-lg border border-dashed p-3">
					<div className="flex flex-col gap-1.5">
						<Label>Description</Label>
						<Textarea
							value={values.description}
							onChange={(e) => set({ description: e.target.value })}
							rows={3}
						/>
					</div>
					<div className="flex flex-wrap items-end gap-4">
						<DateField
							label="Started at"
							value={values.startedAt}
							max={today}
							disabled={values.status === "planned"}
							title={
								values.status === "planned" ? "Available once the task is in progress" : undefined
							}
							onChange={(date) => set({ startedAt: date })}
						/>
						<DateField
							label="Completed at"
							value={values.completedAt}
							min={values.startedAt ?? undefined}
							max={today}
							disabled={values.status !== "completed"}
							title={
								values.status !== "completed" ? "Available once the task is completed" : undefined
							}
							onChange={(date) => set({ completedAt: date })}
						/>
					</div>
				</div>
			)}

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? "Saving…" : initialValues ? "Save changes" : "Create task"}
				</Button>
			</div>
		</form>
	);
};

export { TaskForm };

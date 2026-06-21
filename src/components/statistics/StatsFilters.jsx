import { DateField } from "../ui/shared/DateField";
import { CategoryPicker } from "../ui/shared/CategoryPicker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const iso = (date) => date.toISOString().slice(0, 10);

const PRESETS = [
	{ id: "30", label: "30 days" },
	{ id: "90", label: "90 days" },
	{ id: "365", label: "1 year" },
	{ id: "ytd", label: "This year" },
	{ id: "all", label: "All time" },
];

const GRANULARITY_AUTO = "auto";
const PROJECT_ALL = "all";
const TASKS_ALL = "all";

const presetRange = (id, projects) => {
	const today = new Date();
	const to = iso(today);
	if (id === "ytd") return { from: iso(new Date(Date.UTC(today.getUTCFullYear(), 0, 1))), to };
	if (id === "all") {
		const earliest = projects
			.map((project) => project.createdAt)
			.filter(Boolean)
			.sort()[0];
		return { from: earliest ? earliest.slice(0, 10) : to, to };
	}
	const from = new Date(today);
	from.setUTCDate(from.getUTCDate() - Number(id));
	return { from: iso(from), to };
};

// filters: { from, to, granularity, categoryId, projectId, taskType }
const StatsFilters = ({ filters, onChange, categories = [], projects = [] }) => {
	const set = (patch) => onChange({ ...filters, ...patch });

	const applyPreset = (id) => set({ ...presetRange(id, projects), granularity: "" });

	return (
		<div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
			<div className="flex flex-wrap items-center gap-1.5">
				<span className="mr-1 text-xs font-medium text-muted-foreground">Period:</span>
				{PRESETS.map((preset) => (
					<Button
						key={preset.id}
						type="button"
						variant="outline"
						size="xs"
						className="rounded-full"
						onClick={() => applyPreset(preset.id)}>
						{preset.label}
					</Button>
				))}
			</div>

			<div className="flex flex-wrap items-end gap-3">
				<DateField label="From" value={filters.from} onChange={(date) => set({ from: date })} />
				<DateField label="To" value={filters.to} onChange={(date) => set({ to: date })} />
				<div className="flex flex-col gap-1.5">
					<Label>Granularity</Label>
					<Select
						value={filters.granularity || GRANULARITY_AUTO}
						onValueChange={(next) => set({ granularity: next === GRANULARITY_AUTO ? "" : next })}>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={GRANULARITY_AUTO}>Auto</SelectItem>
							<SelectItem value="day">Day</SelectItem>
							<SelectItem value="week">Week</SelectItem>
							<SelectItem value="month">Month</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Category</Label>
					<CategoryPicker
						value={filters.categoryId ?? null}
						options={categories}
						onChange={(id) => set({ categoryId: id })}
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Project</Label>
					<Select
						value={filters.projectId || PROJECT_ALL}
						onValueChange={(next) => set({ projectId: next === PROJECT_ALL ? null : next })}>
						<SelectTrigger className="w-44">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={PROJECT_ALL}>All projects</SelectItem>
							{projects.map((project) => (
								<SelectItem key={project._id} value={project._id}>
									{project.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>Tasks</Label>
					<Select
						value={filters.taskType || TASKS_ALL}
						onValueChange={(next) => set({ taskType: next === TASKS_ALL ? null : next })}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={TASKS_ALL}>All tasks</SelectItem>
							<SelectItem value="topLevel">Top-level only</SelectItem>
							<SelectItem value="subtasks">Subtasks only</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};

export { StatsFilters };

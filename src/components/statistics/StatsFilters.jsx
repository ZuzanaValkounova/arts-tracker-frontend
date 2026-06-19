import { DateField } from "../ui/DateField";
import { CategoryPicker } from "../ui/CategoryPicker";

const iso = (date) => date.toISOString().slice(0, 10);

const PRESETS = [
	{ id: "30", label: "30 days" },
	{ id: "90", label: "90 days" },
	{ id: "365", label: "1 year" },
	{ id: "ytd", label: "This year" },
	{ id: "all", label: "All time" },
];

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
		<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
			<div className="flex flex-wrap items-center gap-1.5">
				<span className="mr-1 text-xs font-medium text-gray-600">Period:</span>
				{PRESETS.map((preset) => (
					<button
						key={preset.id}
						type="button"
						onClick={() => applyPreset(preset.id)}
						className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-600 hover:border-gray-500 hover:bg-gray-50">
						{preset.label}
					</button>
				))}
			</div>

			<div className="flex flex-wrap items-end gap-3">
				<DateField label="From" value={filters.from} onChange={(date) => set({ from: date })} />
				<DateField label="To" value={filters.to} onChange={(date) => set({ to: date })} />
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Granularity</span>
					<select
						value={filters.granularity ?? ""}
						onChange={(e) => set({ granularity: e.target.value })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="">Auto</option>
						<option value="day">Day</option>
						<option value="week">Week</option>
						<option value="month">Month</option>
					</select>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Category</span>
					<CategoryPicker
						value={filters.categoryId ?? null}
						options={categories}
						onChange={(id) => set({ categoryId: id })}
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Project</span>
					<select
						value={filters.projectId ?? ""}
						onChange={(e) => set({ projectId: e.target.value || null })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="">All projects</option>
						{projects.map((project) => (
							<option key={project._id} value={project._id}>
								{project.name}
							</option>
						))}
					</select>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-xs font-medium text-gray-600">Tasks</span>
					<select
						value={filters.taskType ?? ""}
						onChange={(e) => set({ taskType: e.target.value || null })}
						className="rounded border border-gray-300 px-2 py-1.5 text-sm">
						<option value="">All tasks</option>
						<option value="topLevel">Top-level only</option>
						<option value="subtasks">Subtasks only</option>
					</select>
				</label>
			</div>
		</div>
	);
};

export { StatsFilters };

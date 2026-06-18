import { DateField } from "../ui/DateField";
import { CategoryPicker } from "../ui/CategoryPicker";

// filters: { from, to, granularity, categoryId, projectId, taskType }
const StatsFilters = ({ filters, onChange, categories = [], projects = [] }) => {
	const set = (patch) => onChange({ ...filters, ...patch });

	return (
		<div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
			<DateField label="From" value={filters.from} onChange={(date) => set({ from: date })} />
			<DateField label="To" value={filters.to} onChange={(date) => set({ to: date })} />
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-xs font-medium text-gray-600">Granularity</span>
				<select
					value={filters.granularity ?? "week"}
					onChange={(e) => set({ granularity: e.target.value })}
					className="rounded border border-gray-300 px-2 py-1.5 text-sm">
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
	);
};

export { StatsFilters };

import { useEffect, useState } from "react";
import { FolderKanban, Target, Clock, CircleCheckBig, ListTodo, ListChecks } from "lucide-react";

import { CHART_COLORS } from "./chartStyle";

// count a number up from 0 with an ease-out
const useCountUp = (target, duration = 700) => {
	const [value, setValue] = useState(0);
	useEffect(() => {
		let raf;
		const start = performance.now();
		const tick = (now) => {
			const progress = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(target * eased);
			if (progress < 1) raf = requestAnimationFrame(tick);
			else setValue(target);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);
	return value;
};

const SummaryCard = ({ icon: Icon, color, label, value, suffix = "", hint }) => {
	const animated = useCountUp(value);
	return (
		<div className="flex flex-col gap-2 rounded-xl border bg-card p-3.5 transition-colors hover:border-ring/60">
			<div className="flex items-center gap-2">
				<span
					className="flex size-7 items-center justify-center rounded-lg"
					style={{ backgroundColor: `${color}26`, color }}>
					<Icon className="size-4" />
				</span>
				<span className="text-xs text-muted-foreground">{label}</span>
			</div>
			<div className="text-2xl leading-none font-bold tabular-nums">
				{Math.round(animated)}
				{suffix}
			</div>
			{hint && <div className="text-[10px] text-muted-foreground/70">{hint}</div>}
		</div>
	);
};

// stats: { projects: <GET /statistics/projects>, tasks: <GET /statistics/tasks> }
const SummaryCards = ({ stats }) => {
	const cards = [
		{
			icon: FolderKanban,
			color: CHART_COLORS.lavender,
			label: "Projects",
			value: stats.projects?.total ?? 0,
			hint: "all time",
		},
		{
			icon: Target,
			color: CHART_COLORS.sage,
			label: "Success rate",
			value: Math.round(stats.projects?.successRate ?? 0),
			suffix: " %",
			hint: "completed / non-archived",
		},
		{
			icon: Clock,
			color: CHART_COLORS.gold,
			label: "Avg. project duration",
			value: stats.projects?.averageDuration?.avgDurationDays ?? 0,
			suffix: " d",
			hint: "all time",
		},
		{
			icon: CircleCheckBig,
			color: CHART_COLORS.terracotta,
			label: "Projects completed",
			value: stats.projects?.completedInPeriod ?? 0,
			hint: "in selected period",
		},
		{
			icon: ListTodo,
			color: CHART_COLORS.blue,
			label: "Tasks",
			value: stats.tasks?.total ?? 0,
			hint: "all time",
		},
		{
			icon: ListChecks,
			color: CHART_COLORS.rose,
			label: "Tasks completed",
			value: stats.tasks?.completedCount ?? 0,
			hint: "in selected period",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{cards.map((card) => (
				<SummaryCard key={card.label} {...card} />
			))}
		</div>
	);
};

export { SummaryCards };

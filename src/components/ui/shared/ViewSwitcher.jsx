import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const VIEW_LABELS = {
	list: "List",
	kanban: "Kanban",
	calendar: "Calendar",
};

const ViewSwitcher = ({ value, onChange, options = ["list", "kanban"] }) => {
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			size="sm"
			value={value}
			onValueChange={(next) => next && onChange(next)}>
			{options.map((view) => (
				<ToggleGroupItem key={view} value={view} className="px-3">
					{VIEW_LABELS[view] ?? view}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
};

export { ViewSwitcher };

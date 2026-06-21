import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PROJECT_STATUSES, STATUS_META } from "../../utils/constants";

const ProjectStatusControl = ({ value, onChange }) => {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger
				size="sm"
				className={cn("rounded-full border-0 font-medium", STATUS_META[value]?.className)}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{PROJECT_STATUSES.map((status) => (
					<SelectItem key={status} value={status}>
						{STATUS_META[status].label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export { ProjectStatusControl };

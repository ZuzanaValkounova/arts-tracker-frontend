import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIORITY_META } from "../../../utils/constants";

const PriorityBadge = ({ priority }) => {
	const meta = PRIORITY_META[priority];
	if (!meta) return null;

	return (
		<Badge className={cn("rounded-full px-2 py-0.5 text-[11px]", meta.className)}>
			{meta.label}
		</Badge>
	);
};

export { PriorityBadge };

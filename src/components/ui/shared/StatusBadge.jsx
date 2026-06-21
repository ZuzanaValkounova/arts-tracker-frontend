import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_META } from "../../../utils/constants";

const SIZE_CLASSES = {
	sm: "px-1.5 py-0.5 text-[11px]",
	md: "px-2.5 py-1 text-xs",
};

// status: planned | inProgress | paused | completed | archived (tasks have no "archived")
const StatusBadge = ({ status, size = "md" }) => {
	const meta = STATUS_META[status];
	if (!meta) return null;

	return (
		<Badge className={cn("rounded-full", meta.className, SIZE_CLASSES[size])}>{meta.label}</Badge>
	);
};

export { StatusBadge };

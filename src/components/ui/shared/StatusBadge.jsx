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
		<span
			className={`inline-flex items-center rounded-full font-medium ${meta.className} ${SIZE_CLASSES[size]}`}>
			{meta.label}
		</span>
	);
};

export { StatusBadge };

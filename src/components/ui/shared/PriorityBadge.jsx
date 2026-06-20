import { PRIORITY_META } from "../../../utils/constants";

const PriorityBadge = ({ priority }) => {
	const meta = PRIORITY_META[priority];
	if (!meta) return null;

	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
			{meta.label}
		</span>
	);
};

export { PriorityBadge };

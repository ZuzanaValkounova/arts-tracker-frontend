import { PROJECT_STATUSES, STATUS_META } from "../../utils/constants";

const ProjectStatusControl = ({ value, onChange }) => {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={`rounded-full border-0 px-3 py-1 text-sm font-medium ${STATUS_META[value]?.className ?? ""}`}>
			{PROJECT_STATUSES.map((status) => (
				<option key={status} value={status}>
					{STATUS_META[status].label}
				</option>
			))}
		</select>
	);
};

export { ProjectStatusControl };

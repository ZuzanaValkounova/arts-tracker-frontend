import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// value: ISO string
const DateField = ({ value, onChange, min, max, label, disabled = false, title }) => {
	const dateValue = value ? value.slice(0, 10) : "";

	return (
		<div className="flex flex-col gap-1.5">
			{label && <Label className={cn(disabled && "opacity-50")}>{label}</Label>}
			<Input
				type="date"
				value={dateValue}
				min={min ? min.slice(0, 10) : undefined}
				max={max ? max.slice(0, 10) : undefined}
				disabled={disabled}
				title={title}
				onChange={(e) => onChange(e.target.value || null)}
				className="w-40"
			/>
		</div>
	);
};

export { DateField };

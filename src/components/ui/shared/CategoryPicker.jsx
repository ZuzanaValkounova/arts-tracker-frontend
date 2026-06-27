import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./CategoryIcon";

const NONE = "__none__";
const UNCATEGORIZED = "__uncategorized__";

// value: categoryId | null | UNCATEGORIZED, options: [{ _id, name, icon }]
const CategoryPicker = ({
	value,
	options = [],
	onChange,
	allowEmpty = true,
	emptyLabel = "No category",
	allowUncategorized = false,
	className,
}) => {
	return (
		<Select
			value={value ?? (allowEmpty ? NONE : undefined)}
			onValueChange={(next) => onChange(next === NONE ? null : next)}>
			<SelectTrigger className={cn("w-44", className)}>
				<SelectValue placeholder={emptyLabel} />
			</SelectTrigger>
			<SelectContent>
				{allowEmpty && <SelectItem value={NONE}>{emptyLabel}</SelectItem>}
				{allowUncategorized && <SelectItem value={UNCATEGORIZED}>No category</SelectItem>}
				{options.map((category) => (
					<SelectItem key={category._id} value={category._id}>
						<CategoryIcon name={category.icon} className="size-4 text-muted-foreground" />
						{category.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export { CategoryPicker, UNCATEGORIZED };

import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

// action: optional { label, onClick }
const EmptyState = ({ message = "Nothing here yet.", action }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
			<Inbox className="size-8 text-muted-foreground" />
			<p className="text-sm text-muted-foreground">{message}</p>
			{action && (
				<Button type="button" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	);
};

export { EmptyState };

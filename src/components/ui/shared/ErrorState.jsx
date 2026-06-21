import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-10 text-center">
			<TriangleAlert className="size-8 text-destructive" />
			<p className="text-sm text-destructive">{message}</p>
			{onRetry && (
				<Button type="button" variant="outline" onClick={onRetry}>
					Try again
				</Button>
			)}
		</div>
	);
};

export { ErrorState };

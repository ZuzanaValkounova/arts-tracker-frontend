import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const FormDialog = ({ open, onClose, title, description, children, className }) => {
	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose?.()}>
			<DialogContent className={cn("max-h-[90dvh] overflow-y-auto sm:max-w-lg", className)}>
				{title ? (
					<DialogHeader className="text-center">
						<DialogTitle>{title}</DialogTitle>
						{description ? <DialogDescription>{description}</DialogDescription> : null}
					</DialogHeader>
				) : null}
				{children}
			</DialogContent>
		</Dialog>
	);
};

export { FormDialog };

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmDialog = ({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	destructive = false,
	onConfirm,
	onCancel,
}) => {
	return (
		<AlertDialog open={open} onOpenChange={(next) => !next && onCancel?.()}>
			<AlertDialogContent>
				<AlertDialogHeader className="text-center">
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && <AlertDialogDescription>{description}</AlertDialogDescription>}
				</AlertDialogHeader>
				<AlertDialogFooter className="sm:justify-center">
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export { ConfirmDialog };

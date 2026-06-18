import { useEffect, useRef } from "react";

const Modal = ({ open, onClose, title, children, widthClass = "max-w-lg" }) => {
	const dialogRef = useRef(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			onClick={(e) => {
				if (e.target === dialogRef.current) onClose();
			}}
			className={`m-auto w-full ${widthClass} rounded-xl p-0 shadow-xl backdrop:bg-black/40`}>
			<div className="p-5">
				{title && (
					<div className="mb-4 flex items-start justify-between gap-4">
						<h2 className="text-lg font-semibold">{title}</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600"
							aria-label="Close">
							✕
						</button>
					</div>
				)}
				{children}
			</div>
		</dialog>
	);
};

export { Modal };

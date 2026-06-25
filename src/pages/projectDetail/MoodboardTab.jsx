import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { MoodboardCanvas } from "../../components/moodboard/MoodboardCanvas";
import { MoodboardToolbar } from "../../components/moodboard/MoodboardToolbar";
import { FormDialog } from "../../components/ui/shared/FormDialog";
import { ImageUpload } from "../../components/ui/shared/ImageUpload";
import { EmptyState } from "../../components/ui/shared/EmptyState";
import { LoadingState } from "../../components/ui/shared/LoadingState";
import { ErrorState } from "../../components/ui/shared/ErrorState";

import {
	getMoodboard,
	createMoodboard,
	createMoodboardElement,
	updateMoodboardElement,
	deleteMoodboardElement,
} from "../../api/moodboard";
import { useAuth } from "../../contexts/AuthContext";

const MoodboardTab = ({ project }) => {
	const [token] = useAuth();
	const queryClient = useQueryClient();
	const projectId = project._id;

	const [activeTool, setActiveTool] = useState("select");
	const [activeColor, setActiveColor] = useState("#3b82f6");
	const [extraPalette, setExtraPalette] = useState([]);
	const [pendingImage, setPendingImage] = useState(null);

	const moodboardKey = ["moodboard", projectId];
	const moodboardQuery = useQuery({
		queryKey: moodboardKey,
		queryFn: () => getMoodboard(token, projectId),
		retry: (failureCount, error) => error.status !== 404 && failureCount < 2,
	});

	const setBoard = (board) => queryClient.setQueryData(moodboardKey, board);

	const createBoardMutation = useMutation({
		mutationFn: () => createMoodboard(token, projectId),
		onSuccess: (board) => {
			toast.success("Moodboard created");
			setBoard(board);
		},
	});
	const addElementMutation = useMutation({
		mutationFn: (element) => createMoodboardElement(token, projectId, element),
		// optimistically show the new element immediately
		onMutate: (element) => {
			if (element.imageFile) return undefined;
			queryClient.cancelQueries({ queryKey: moodboardKey });
			const previous = queryClient.getQueryData(moodboardKey);
			const optimisticElement = { ...element, _id: `temp-${Date.now()}` };
			queryClient.setQueryData(moodboardKey, (board) =>
				board ? { ...board, elements: [...board.elements, optimisticElement] } : board,
			);
			return { previous };
		},
		onError: (_error, _variables, context) => context?.previous && setBoard(context.previous),
		onSuccess: setBoard,
	});
	const updateElementMutation = useMutation({
		mutationFn: ({ elementId, patch }) =>
			updateMoodboardElement(token, projectId, elementId, patch),
		onMutate: async ({ elementId, patch }) => {
			await queryClient.cancelQueries({ queryKey: moodboardKey });
			const previous = queryClient.getQueryData(moodboardKey);
			queryClient.setQueryData(moodboardKey, (board) =>
				board
					? {
							...board,
							elements: board.elements.map((element) =>
								element._id === elementId ? { ...element, ...patch } : element,
							),
						}
					: board,
			);
			return { previous };
		},
		onError: (_error, _variables, context) => context?.previous && setBoard(context.previous),
		onSuccess: setBoard,
	});
	const deleteElementMutation = useMutation({
		mutationFn: (elementId) => deleteMoodboardElement(token, projectId, elementId),
		onMutate: async (elementId) => {
			await queryClient.cancelQueries({ queryKey: moodboardKey });
			const previous = queryClient.getQueryData(moodboardKey);
			queryClient.setQueryData(moodboardKey, (board) =>
				board
					? { ...board, elements: board.elements.filter((element) => element._id !== elementId) }
					: board,
			);
			return { previous };
		},
		onError: (_error, _variables, context) => context?.previous && setBoard(context.previous),
		onSuccess: setBoard,
	});

	const elements = moodboardQuery.data?.elements ?? [];

	const palette = useMemo(() => {
		const fromElements = (moodboardQuery.data?.elements ?? [])
			.filter((element) => element.type === "color")
			.map((element) => element.hex);
		return [...new Set([...fromElements, ...extraPalette])];
	}, [moodboardQuery.data, extraPalette]);

	const handleElementAdd = (element) => {
		if (element.type === "image") {
			setPendingImage(element);
			return;
		}
		addElementMutation.mutate(element);
	};

	if (moodboardQuery.isLoading) return <LoadingState />;

	if (moodboardQuery.isError && moodboardQuery.error.status === 404) {
		return (
			<EmptyState
				message="This project has no moodboard yet."
				action={{ label: "Create moodboard", onClick: () => createBoardMutation.mutate() }}
			/>
		);
	}

	if (moodboardQuery.isError)
		return <ErrorState message={moodboardQuery.error.message} onRetry={moodboardQuery.refetch} />;

	return (
		<div className="flex h-[calc(100vh-13rem)] min-h-130 flex-col gap-3">
			<MoodboardToolbar
				activeTool={activeTool}
				onToolChange={setActiveTool}
				palette={palette}
				onAddColor={(hex) => setExtraPalette((prev) => [...new Set([...prev, hex])])}
				activeColor={activeColor}
				onActiveColorChange={setActiveColor}
			/>
			<div className="min-h-0 flex-1">
				<MoodboardCanvas
					elements={elements}
					activeTool={activeTool}
					activeColor={activeColor}
					onElementAdd={handleElementAdd}
					onElementChange={(elementId, patch) => updateElementMutation.mutate({ elementId, patch })}
					onElementDelete={(elementId) => deleteElementMutation.mutate(elementId)}
				/>
			</div>

			<FormDialog
				open={Boolean(pendingImage)}
				onClose={() => setPendingImage(null)}
				title="Add image"
				className="sm:max-w-md">
				<ImageUpload
					value={null}
					onSelect={(file) => {
						addElementMutation.mutate({ ...pendingImage, imageFile: file });
						setPendingImage(null);
					}}
					onSelectUrl={(url) => {
						addElementMutation.mutate({ ...pendingImage, imageUrl: url });
						setPendingImage(null);
					}}
				/>
			</FormDialog>
		</div>
	);
};

export { MoodboardTab };

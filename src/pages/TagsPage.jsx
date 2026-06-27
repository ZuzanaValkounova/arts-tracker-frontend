import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TagManager } from "../components/tag/TagManager";
import { LoadingState } from "../components/ui/shared/LoadingState";
import { ErrorState } from "../components/ui/shared/ErrorState";

import { getTags, createTag, updateTag, deleteTag } from "../api/tags";
import { useAuth } from "../contexts/useAuth";

const TagsPage = () => {
	const [token] = useAuth();
	const queryClient = useQueryClient();

	const tagsQuery = useQuery({ queryKey: ["tags"], queryFn: () => getTags(token) });

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tags"] });

	const createMutation = useMutation({
		mutationFn: (values) => createTag(token, values),
		onSuccess: () => {
			toast.success("Tag created");
			invalidate();
		},
	});
	const updateMutation = useMutation({
		mutationFn: ({ tagId, values }) => updateTag(token, tagId, values),
		onSuccess: () => {
			toast.success("Tag updated");
			invalidate();
		},
	});
	const deleteMutation = useMutation({
		mutationFn: (tagId) => deleteTag(token, tagId),
		onSuccess: () => {
			toast.success("Tag deleted");
			invalidate();
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	if (tagsQuery.isLoading) return <LoadingState />;
	if (tagsQuery.isError)
		return <ErrorState message={tagsQuery.error.message} onRetry={tagsQuery.refetch} />;

	const mutationError = createMutation.error?.message ?? updateMutation.error?.message ?? null;

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
			<h1 className="text-xl font-bold">Tags</h1>
			<TagManager
				tags={tagsQuery.data ?? []}
				onCreate={createMutation.mutate}
				onUpdate={(tagId, values) => updateMutation.mutate({ tagId, values })}
				onDelete={deleteMutation.mutate}
				mutationError={mutationError}
			/>
		</div>
	);
};

export { TagsPage };

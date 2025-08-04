"use client";

import { Post } from "@/types";
import { useDeletePost, useUpdatePost } from "@/hooks/mutations";

export const usePostOperationsWithMutations = (
  posts: Post[],
  toastFn?: (message: string, options?: { success?: boolean }) => void
) => {
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const handleDropPostInFolder = async (postId: string, folderId: string) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        folderId: folderId,
      });
      toastFn?.("Post moved to folder successfully", { success: true });
    } catch (error) {
      console.error("Failed to move post to folder:", error);
      toastFn?.("Failed to move post to folder", { success: false });
    }
  };

  const handleMovePost = (draggedId: string, targetId: string) => {
    // This is for reordering posts within a view - can be handled later
    // For now, we'll keep the basic implementation
    console.log("Reorder posts:", { draggedId, targetId });
  };

  const handleReschedulePost = async (postId: string, newDate: string) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        scheduledAt: newDate,
        status: "scheduled",
      });
      toastFn?.("Post rescheduled successfully", { success: true });
    } catch (error) {
      console.error("Failed to reschedule post:", error);
      toastFn?.("Failed to reschedule post", { success: false });
    }
  };

  const handleUnschedulePost = async (postId: string) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        scheduledAt: undefined,
        status: "draft",
      });
      toastFn?.("Post unscheduled successfully", { success: true });
    } catch (error) {
      console.error("Failed to unschedule post:", error);
      toastFn?.("Failed to unschedule post", { success: false });
    }
  };

  const handleEditPost = async (updatedPost: Post) => {
    try {
      await updatePostMutation.mutateAsync({
        id: updatedPost.id,
        caption: updatedPost.caption,
        hashtags: updatedPost.hashtags,
        imagePrompt: updatedPost.imagePrompt,
        platform: updatedPost.platform,
        folderId: updatedPost.folderId,
      });
      toastFn?.("Post updated successfully", { success: true });
    } catch (error) {
      console.error("Failed to update post:", error);
      toastFn?.("Failed to update post", { success: false });
    }
  };

  const handleSchedulePost = async (postId: string, scheduledDate: string) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        scheduledAt: scheduledDate,
        status: "scheduled",
      });
      toastFn?.("Post scheduled successfully", { success: true });
    } catch (error) {
      console.error("Failed to schedule post:", error);
      toastFn?.("Failed to schedule post", { success: false });
    }
  };

  const handleDeletePost = async (postId: string) => {
    // This would need a separate delete mutation
    // For now, we'll just log i
    try {
      await deletePostMutation.mutateAsync(postId);
      toastFn?.("Post deleted successfully", { success: true });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toastFn?.("Failed to delete post", { success: false });
    }
  };

  // These utility functions remain the same as they're just filtering
  const getPostsInFolder = (folderId: string) =>
    posts.filter((post) => post.folderId === folderId);

  const getUnorganizedPosts = () => posts.filter((post) => !post.folderId);

  const getDisplayedPosts = (selectedFolderId: string | null) => {
    if (selectedFolderId) {
      return getPostsInFolder(selectedFolderId);
    }
    return getUnorganizedPosts();
  };

  return {
    handleMovePost,
    handleDropPostInFolder,
    handleReschedulePost,
    handleUnschedulePost,
    handleEditPost,
    handleSchedulePost,
    handleDeletePost,
    getPostsInFolder,
    getUnorganizedPosts,
    getDisplayedPosts,
    // Add mutation state for UI feedback
    isUpdating: updatePostMutation.isPending,
  };
};

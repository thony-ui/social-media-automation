"use client";

import { useDeleteFolder, useUpdateFolder } from "./mutations";

export const useFolderOperationsWithMutations = (
  toastFn?: (message: string, options?: { success?: boolean }) => void
) => {
  const deleteFolderMutation = useDeleteFolder();
  const editFolderMutation = useUpdateFolder();

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await editFolderMutation.mutateAsync({
        id: folderId,
        name: newName,
      });
      toastFn?.("Folder renamed successfully", { success: true });
    } catch {
      toastFn?.("Failed to rename folder", { success: false });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Move posts out of folder before deleting
      await deleteFolderMutation.mutateAsync({
        folderId,
        moveToFolderId: undefined,
      });

      toastFn?.("Folder deleted successfully", { success: true });
    } catch {
      toastFn?.("Failed to delete folder", { success: false });
    }
  };

  return {
    handleRenameFolder,
    handleDeleteFolder,
  };
};

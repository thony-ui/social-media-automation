"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const baseUrl = "/v1/folders";

export interface DeleteFolderData {
  folderId: string;
  moveToFolderId?: string;
}

export interface DeleteFolderResponse {
  success: boolean;
  message: string;
}

const deleteFolder = async ({
  folderId,
  moveToFolderId,
}: DeleteFolderData): Promise<DeleteFolderResponse> => {
  const response = await axiosInstance.delete(`${baseUrl}/${folderId}`, {
    data: moveToFolderId ? { moveToFolderId } : undefined,
  });
  return response.data;
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      // Invalidate both posts and folders queries since folder deletion affects both
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete folder:", error);
    },
  });
};

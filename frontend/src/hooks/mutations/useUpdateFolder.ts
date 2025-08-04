"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { FolderType } from "@/types";

const baseUrl = "/v1/folders";

export interface UpdateFolderData {
  id: string;
  name?: string;
  description?: string;
  color?: string;
}

export interface UpdateFolderResponse {
  success: boolean;
  message: string;
  data: FolderType;
}

const updateFolder = async (
  folderData: UpdateFolderData
): Promise<UpdateFolderResponse> => {
  const { id, ...updateData } = folderData;
  const response = await axiosInstance.put(`${baseUrl}/${id}`, updateData);
  return response.data;
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFolder,
    onSuccess: (data) => {
      // Invalidate and refetch folders queries
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update folder:", error);
      // You can add toast notification here if needed
    },
  });
};

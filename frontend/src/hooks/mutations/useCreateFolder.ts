"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { FolderType } from "@/types";

const baseUrl = "/v1/folders";

export interface CreateFolderData {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateFolderResponse {
  success: boolean;
  message: string;
  data: FolderType;
}

const createFolder = async (
  folderData: CreateFolderData
): Promise<CreateFolderResponse> => {
  const response = await axiosInstance.post(`${baseUrl}`, folderData);
  return response.data;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: (data) => {
      // Invalidate and refetch folders queries
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create folder:", error);
      // You can add toast notification here if needed
    },
  });
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";

const baseUrl = "/v1/posts";

export interface DeletePostData {
  postId: string;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

const deletePost = async (postId: string): Promise<DeletePostResponse> => {
  const response = await axiosInstance.delete(`${baseUrl}/${postId}`);
  return response.data;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate posts queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Also invalidate folders in case post counts changed
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete post:", error);
    },
  });
};

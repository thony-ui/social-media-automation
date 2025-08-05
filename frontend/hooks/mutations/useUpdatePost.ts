"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { Post } from "../../types";

const baseUrl = "/v1/posts";

export interface UpdatePostData {
  id: string;
  caption?: string;
  hashtags?: string;
  imagePrompt?: string;
  platform?: string;
  folderId?: string;
  scheduledAt?: string;
  status?: string;
}

export interface UpdatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

const updatePost = async (
  postData: UpdatePostData
): Promise<UpdatePostResponse> => {
  const { id, ...updateData } = postData;
  const response = await axiosInstance.put(`${baseUrl}/${id}`, updateData);
  return response.data;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update post:", error);
      // You can add toast notification here if needed
    },
  });
};

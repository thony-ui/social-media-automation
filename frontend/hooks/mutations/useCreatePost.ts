"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { Post } from "../../types";

const baseUrl = "/v1/posts";

export interface CreatePostData {
  caption: string;
  hashtags?: string;
  imagePrompt?: string;
  platform?: string;
  folderId?: string;
  scheduledAt?: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

const createPost = async (
  postData: CreatePostData
): Promise<CreatePostResponse> => {
  const response = await axiosInstance.post(`${baseUrl}`, postData);
  return response.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Optionally update the cache directly
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) => {
        if (!oldData) return [data.data];
        return [data.data, ...oldData];
      });
    },
    onError: (error: Error) => {
      console.error("Failed to create post:", error);
      // You can add toast notification here if needed
    },
  });
};

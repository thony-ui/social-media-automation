"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const baseUrl = "/v1/posts";

export interface CreatePostDataWithAi {
  brandName: string;
  productDescription: string;
  targetAudience: string;
  numberOfPosts: number;
}

const createPostWithAi = async (
  postData: CreatePostDataWithAi
): Promise<void> => {
  await axiosInstance.post(`${baseUrl}/generate-content`, postData);
};

export const useCreatePostWithAi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithAi,
    onSuccess: () => {
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create post:", error);
      // You can add toast notification here if needed
    },
  });
};

"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { Post } from "../../types";

const baseUrl = "/v1/posts";

export interface GetPostsParams {
  status?: string;
  platform?: string;
  folderId?: string;
  limit?: number;
  offset?: number;
}

export interface GetPostsResponse {
  success: boolean;
  message: string;
  data: Post[];
  total: number;
}

const getPosts = async (params?: GetPostsParams): Promise<GetPostsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.append("status", params.status);
  if (params?.platform) searchParams.append("platform", params.platform);
  if (params?.folderId) searchParams.append("folderId", params.folderId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.offset) searchParams.append("offset", params.offset.toString());

  const url = searchParams.toString()
    ? `${baseUrl}?${searchParams.toString()}`
    : baseUrl;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const useGetPosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

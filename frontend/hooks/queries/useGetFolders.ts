"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { FolderType } from "../../types";

const baseUrl = "/v1/folders";

export interface GetFoldersResponse {
  success: boolean;
  message: string;
  data: FolderType[];
}

const getFolders = async (): Promise<GetFoldersResponse> => {
  const response = await axiosInstance.get(baseUrl);
  return response.data;
};

export const useGetFolders = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

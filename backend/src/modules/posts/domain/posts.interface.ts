export interface IPost {
  id: string;
  userId: string;
  caption: string;
  hashtags?: string;
  platform?: "instagram" | "twitter" | "facebook" | "linkedin" | "all";
  folderId?: string;
  imagePrompt?: string;
  imageUrl?: string;
  status: "draft" | "scheduled" | "published";
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePostRequest {
  caption: string;
  hashtags?: string;
  platform?: string;
  folderId?: string;
  imagePrompt?: string;
  scheduledAt?: string;
}

export interface IUpdatePostRequest {
  id: string;
  caption?: string;
  hashtags?: string;
  platform?: string;
  folderId?: string | null;
  imagePrompt?: string;
  scheduledAt?: string;
  status?: string;
}

export interface IGenerateContentRequest {
  prompt: string;
  platform?: string;
  tone?: "professional" | "casual" | "friendly" | "formal" | "creative";
  includeHashtags?: boolean;
  maxLength?: number;
}

export interface IPostService {
  createPost: (data: ICreatePostRequest & { userId: string }) => Promise<IPost>;
  updatePost: (data: IUpdatePostRequest) => Promise<IPost>;
  deletePost: (id: string, userId: string) => Promise<void>;
  getPost: (id: string, userId: string) => Promise<IPost>;
  getPosts: (userId: string, filters?: any) => Promise<IPost[]>;
  schedulePost: (
    id: string,
    scheduledAt: string,
    userId: string
  ) => Promise<IPost>;
  unschedulePost: (id: string, userId: string) => Promise<IPost>;
  movePostToFolder: (
    postId: string,
    folderId: string,
    userId: string
  ) => Promise<IPost>;
  generateContent: (
    data: IGenerateContentRequest
  ) => Promise<{ caption: string; hashtags?: string }>;
}

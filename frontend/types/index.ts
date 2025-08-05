// Shared type definitions for the AutoContent Studio application

export interface Post {
  id: string;
  caption: string;
  hashtags: string;
  imagePrompt?: string;
  imageUrl?: string;
  scheduledAt?: string;
  status: string;
  platform?: string;
  createdAt: string;
  folderId?: string;
}

export interface FolderType {
  id: string;
  name: string;
  createdAt: string;

  color?: string;
}

export type ViewType = "posts" | "schedule";

export interface DragItem {
  id: string;
  type: string;
}

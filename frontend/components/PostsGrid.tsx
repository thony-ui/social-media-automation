"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Post, FolderType } from "../types";
import PostCard from "./PostCard";

interface PostsGridProps {
  posts: Post[];
  folders: FolderType[];
  selectedFolderId: string | null;
  onMovePost: (draggedId: string, targetId: string) => void;
  onEditPost: (updatedPost: Post) => void;
  onSchedulePost: (postId: string, scheduledDate: string) => void;
  onUnschedulePost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onGeneratePosts: () => void;
}

export default function PostsGrid({
  posts,
  folders,
  selectedFolderId,
  onMovePost,
  onEditPost,
  onSchedulePost,
  onUnschedulePost,
  onDeletePost,
  onGeneratePosts,
}: PostsGridProps) {
  const getSelectedFolderName = () => {
    if (!selectedFolderId) return "All Posts";
    return (
      folders.find((f) => f.id === selectedFolderId)?.name || "Unknown Folder"
    );
  };

  const getPostsCount = () => {
    return selectedFolderId
      ? posts.filter((post) => post.folderId === selectedFolderId).length
      : posts.filter((post) => !post.folderId).length;
  };

  const getDisplayDescription = () => {
    return selectedFolderId
      ? `${getPostsCount()} posts in this folder`
      : `${getPostsCount()} unorganized posts`;
  };

  return (
    <div className="flex-1 w-full">
      <div className="mb-4 px-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {getSelectedFolderName()}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {getDisplayDescription()}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onMove={onMovePost}
            onEdit={onEditPost}
            onSchedule={onSchedulePost}
            onUnschedule={onUnschedulePost}
            onDelete={onDeletePost}
          />
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedFolderId ? "No posts in this folder" : "No posts yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedFolderId
                ? "Drag and drop posts here to organize them"
                : "Create your first campaign or generate posts to get started"}
            </p>
            {!selectedFolderId && (
              <Button onClick={onGeneratePosts}>
                Generate Your First Posts
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

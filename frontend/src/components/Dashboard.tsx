"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ViewType } from "@/types";
import { usePostOperationsWithMutations } from "@/hooks/usePostOperationsWithMutations";
import { useGetPosts, useGetFolders } from "@/hooks/queries";

import DashboardNavigation from "./DashboardNavigation";
import DashboardActions from "./DashboardActions";
import FolderSidebar from "./FolderSidebar";
import PostsGrid from "./PostsGrid";
import FolderEditModal from "./FolderEditModal";
import FolderDeleteConfirmDialog from "./FolderDeleteConfirmDialog";
import PostGenerationForm from "./PostGenerationForm";
import CreatePostModal from "./CreatePostModal";
import CreateFolderModal from "./CreateFolderModal";
import ScheduleCalendar from "./ScheduleCalendar";
import { showToast } from "@/utils/toast-helper";
import { useFolderOperationsWithMutations } from "@/hooks/useFolderOperationsWithMutation";

export default function Dashboard() {
  // State Management
  const [isGenerateFormOpen, setIsGenerateFormOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<ViewType>("posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<{
    id: string;
    name: string;
    postCount: number;
  } | null>(null);

  // API Queries
  const {
    data: postsResponse,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPosts();

  const {
    data: foldersResponse,
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useGetFolders();

  // Extract data from responses
  const posts = postsResponse?.data || [];
  const folders = foldersResponse?.data || [];

  // Custom Hooks - no longer need getMockFolders since we use API
  const postOps = usePostOperationsWithMutations(posts, showToast);
  const folderOps = useFolderOperationsWithMutations(
    () => {} // No longer need setFolders since React Query handles the cache
  );

  // Remove mock data initialization since we're using API data

  // Event Handlers
  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleEditFolder = (folderId: string, folderName: string) => {
    setEditingFolder({ id: folderId, name: folderName });
  };

  const handleCloseEditModal = () => {
    setEditingFolder(null);
  };

  const handleUpdateFolderName = (name: string) => {
    setEditingFolder((prev) => (prev ? { ...prev, name } : null));
  };

  const handleGeneratePostsFromGrid = () => {
    setIsGenerateFormOpen(true);
  };

  const handleCreatePost = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCreateFolder = () => {
    setIsCreateFolderModalOpen(true);
  };

  const handleDeleteFolderRequest = (folderId: string, folderName: string) => {
    const postCount = postOps.getPostsInFolder(folderId).length;
    setDeletingFolder({ id: folderId, name: folderName, postCount });
  };

  const handleConfirmDeleteFolder = () => {
    if (deletingFolder) {
      folderOps.handleDeleteFolder(deletingFolder.id);
      setDeletingFolder(null);
    }
  };

  // Handle loading state
  if (isLoadingPosts || isLoadingFolders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardNavigation
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (postsError || foldersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardNavigation
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Failed to load dashboard data
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  AutoContent Studio
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-powered content creation and scheduling for your social
                  media success
                </p>
              </div>

              {/* Navigation at header level */}
              <DashboardNavigation
                selectedView={selectedView}
                onViewChange={setSelectedView}
              />
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => {
                // Reset to default view - could navigate to main dashboard if needed
                setSelectedView("posts");
                setSelectedFolderId(null);
              }}
              className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Dashboard
            </button>
            <span>→</span>
            <button
              onClick={() => {
                // Allow switching between views via breadcrumb
                setSelectedView(
                  selectedView === "posts" ? "schedule" : "posts"
                );
              }}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
            >
              {selectedView === "posts"
                ? "Content Studio"
                : "Schedule & Calendar"}
            </button>
          </div>

          {/* Action Buttons */}
          <DashboardActions
            onGeneratePosts={() => setIsGenerateFormOpen(true)}
            onCreatePost={handleCreatePost}
            onCreateFolder={handleCreateFolder}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Main Content */}
          {selectedView === "posts" && (
            <div className="flex gap-6">
              <FolderSidebar
                folders={folders}
                selectedFolderId={selectedFolderId}
                unorganizedPostsCount={postOps.getUnorganizedPosts().length}
                isOpen={isSidebarOpen}
                onSelectFolder={handleSelectFolder}
                onEditFolder={handleEditFolder}
                onDeleteFolder={handleDeleteFolderRequest}
                onDropPost={postOps.handleDropPostInFolder}
                getPostsInFolderCount={(folderId) =>
                  postOps.getPostsInFolder(folderId).length
                }
              />

              <PostsGrid
                posts={postOps.getDisplayedPosts(selectedFolderId)}
                folders={folders}
                selectedFolderId={selectedFolderId}
                onMovePost={postOps.handleMovePost}
                onEditPost={postOps.handleEditPost}
                onSchedulePost={postOps.handleSchedulePost}
                onUnschedulePost={postOps.handleUnschedulePost}
                onDeletePost={postOps.handleDeletePost}
                onGeneratePosts={handleGeneratePostsFromGrid}
              />
            </div>
          )}

          {selectedView === "schedule" && (
            <ScheduleCalendar posts={posts} toastFn={showToast} />
          )}

          {/* Dialogs and Modals */}

          <PostGenerationForm
            open={isGenerateFormOpen}
            onOpenChange={setIsGenerateFormOpen}
            onPostsGenerated={(newPosts) => {
              // Posts will be automatically refetched by React Query
              // after the mutation completes
              setIsGenerateFormOpen(false);
              showToast(`Generated ${newPosts.length} posts successfully!`, {
                success: true,
              });
            }}
          />

          <CreatePostModal
            open={isCreatePostModalOpen}
            onOpenChange={setIsCreatePostModalOpen}
          />

          <CreateFolderModal
            open={isCreateFolderModalOpen}
            onOpenChange={setIsCreateFolderModalOpen}
          />

          <FolderEditModal
            editingFolder={editingFolder}
            onClose={handleCloseEditModal}
            onSave={folderOps.handleRenameFolder}
            onUpdateName={handleUpdateFolderName}
          />

          <FolderDeleteConfirmDialog
            open={!!deletingFolder}
            onOpenChange={() => setDeletingFolder(null)}
            folderName={deletingFolder?.name || ""}
            postCount={deletingFolder?.postCount || 0}
            onConfirm={handleConfirmDeleteFolder}
          />
        </div>
      </div>
    </DndProvider>
  );
}

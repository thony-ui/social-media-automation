"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ViewType } from "../types";
import { usePostOperationsWithMutations } from "../hooks/usePostOperationsWithMutations";
import { useGetPosts, useGetFolders } from "../hooks/queries";

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
import { showToast } from "../utils/toast-helper";
import { useFolderOperationsWithMutations } from "../hooks/useFolderOperationsWithMutation";

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
  const folderOps = useFolderOperationsWithMutations();

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  // Handle error state
  if (postsError || foldersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  AutoContent Studio
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
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
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-1">
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
          />

          {/* Main Content */}
          {selectedView === "posts" && (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Mobile Folder Toggle */}
              <div className="lg:hidden sticky">
                <Button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  variant="outline"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  {isSidebarOpen ? "Hide Folders" : "Show Folders"}
                </Button>
              </div>

              {/* Sidebar with mobile overlay */}
              <div
                className={`
                fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto
                ${isSidebarOpen ? "block" : "hidden lg:block"}
                lg:w-72 lg:flex-shrink-0
              `}
              >
                {/* Mobile backdrop */}
                <div
                  className={`absolute inset-0 bg-opacity-50 lg:hidden ${
                    isSidebarOpen ? "block" : "hidden"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar content */}
                <div className="relative lg:relative">
                  <FolderSidebar
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    unorganizedPostsCount={postOps.getUnorganizedPosts().length}
                    isOpen={isSidebarOpen}
                    onSelectFolder={(folderId) => {
                      handleSelectFolder(folderId);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    onEditFolder={handleEditFolder}
                    onDeleteFolder={handleDeleteFolderRequest}
                    onDropPost={postOps.handleDropPostInFolder}
                    getPostsInFolderCount={(folderId) =>
                      postOps.getPostsInFolder(folderId).length
                    }
                    onClose={() => setIsSidebarOpen(false)}
                  />
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 min-w-0">
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
            </div>
          )}

          {selectedView === "schedule" && (
            <ScheduleCalendar posts={posts} toastFn={showToast} />
          )}

          {/* Dialogs and Modals */}

          <PostGenerationForm
            open={isGenerateFormOpen}
            onOpenChange={setIsGenerateFormOpen}
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

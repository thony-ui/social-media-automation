"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, X, Search } from "lucide-react";
import { FolderType } from "@/types";
import DroppableFolderButton from "./DroppableFolderButton";

interface FolderSidebarProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  unorganizedPostsCount: number;
  isOpen: boolean;
  onSelectFolder: (folderId: string | null) => void;
  onEditFolder: (folderId: string, folderName: string) => void;
  onDeleteFolder: (folderId: string, folderName: string) => void;
  onDropPost: (postId: string, folderId: string) => void;
  getPostsInFolderCount: (folderId: string) => number;
  onClose?: () => void;
}

export default function FolderSidebar({
  folders,
  selectedFolderId,
  unorganizedPostsCount,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder,
  onDropPost,
  getPostsInFolderCount,
  onClose,
}: FolderSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) {
      return folders;
    }

    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };
  return (
    <div className="w-full lg:w-72 lg:flex-shrink-0">
      <Card className="h-fit lg:sticky lg:top-4 max-h-[calc(100vh-2rem)] overflow-hidden bg-white dark:bg-gray-800 shadow-lg lg:shadow-none rounded-none lg:rounded-lg">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              Folders
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredFolders.length} of {folders.length})
                </span>
              )}
            </CardTitle>

            {/* Close button for mobile */}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 cursor-text"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 cursor-pointer hover:bg-gray-100"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {/* All Posts Option */}
          <Button
            variant={selectedFolderId === null ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => onSelectFolder(null)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            All Posts ({unorganizedPostsCount})
          </Button>

          {/* Folder List */}
          <div className="space-y-1">
            {filteredFolders.map((folder) => (
              <DroppableFolderButton
                key={folder.id}
                folderId={folder.id}
                folderName={folder.name}
                folderColor={folder.color}
                postCount={getPostsInFolderCount(folder.id)}
                isSelected={selectedFolderId === folder.id}
                onSelect={() => onSelectFolder(folder.id)}
                onEdit={() => onEditFolder(folder.id, folder.name)}
                onDelete={() => onDeleteFolder(folder.id, folder.name)}
                onDropPost={onDropPost}
              />
            ))}
          </div>

          {/* Empty States */}
          {folders.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No folders yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Create a folder to organize your posts
              </p>
            </div>
          )}

          {folders.length > 0 &&
            filteredFolders.length === 0 &&
            searchQuery && (
              <div className="text-center py-4 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No folders found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching with different keywords
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                  className="mt-2 cursor-pointer"
                >
                  Clear search
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

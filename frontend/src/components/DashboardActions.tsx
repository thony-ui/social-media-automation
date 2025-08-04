"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Download, FolderPlus, Menu, Zap, Plus } from "lucide-react";

interface DashboardActionsProps {
  onGeneratePosts: () => void;
  onCreatePost: () => void;
  onCreateFolder: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function DashboardActions({ 
  onGeneratePosts,
  onCreatePost, 
  onCreateFolder, 
  onToggleSidebar,
  isSidebarOpen 
}: DashboardActionsProps) {
  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-dashed">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          
          <Button
            onClick={onGeneratePosts}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            size="lg"
            variant="default"
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden sm:inline">AI Generate</span>
            <span className="sm:hidden">Generate</span>
          </Button>

          <Button
            onClick={onCreatePost}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            size="lg"
            variant="default"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onCreateFolder}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
            variant="outline"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden md:inline">New Folder</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onToggleSidebar}
            className="flex items-center gap-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="sr-only">{isSidebarOpen ? 'Hide' : 'Show'} Folders</span>
          </Button>
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">Quick tip:</span>
          <span>Use AI Generate for bulk content creation or Create Post for manual control</span>
        </div>
      </div>
    </Card>
  );
}

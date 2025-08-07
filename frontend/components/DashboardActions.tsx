"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Sparkles, Download, FolderPlus, Zap, Plus } from "lucide-react";

interface DashboardActionsProps {
  onGeneratePosts: () => void;
  onCreatePost: () => void;
  onCreateFolder: () => void;
  onExport: () => void;
}

export default function DashboardActions({
  onGeneratePosts,
  onCreatePost,
  onCreateFolder,
  onExport,
}: DashboardActionsProps) {
  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-dashed">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
          <Button
            onClick={onGeneratePosts}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            size="lg"
            variant="default"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">AI Generate</span>
          </Button>

          <Button
            onClick={onCreatePost}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            size="lg"
            variant="default"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Create Post</span>
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onCreateFolder}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center"
            variant="outline"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="text-sm">New Folder</span>
          </Button>

          <Button
            onClick={onExport}
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Quick Tips - Hidden on mobile */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 hidden sm:block">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">Quick tip:</span>
          <span>
            Use AI Generate for bulk content creation or Create Post for manual
            control
          </span>
        </div>
      </div>
    </Card>
  );
}

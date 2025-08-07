"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Loader2 } from "lucide-react";
import { FolderType, Post } from "@/types";
import { generatePostsPDF } from "@/utils/pdfExport";
import { showToast } from "@/utils/toast-helper";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: FolderType[];
  posts: Post[];
}

export default function ExportModal({
  open,
  onOpenChange,
  folders,
  posts,
}: ExportModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [query, setQuery] = useState("");

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [folders, query]);

  const getPostCount = (folderId: string | null) => {
    if (folderId === null) {
      return posts.length; // All posts
    }
    return posts.filter((post) => post.folderId === folderId).length;
  };

  const getFolderName = (folderId: string | null) => {
    if (folderId === null) return "All Posts";
    return folders.find((f) => f.id === folderId)?.name || "Unknown Folder";
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      generatePostsPDF({
        folderId: selectedFolderId,
        posts,
        folders,
      });
      showToast("PDF exported successfully!", {
        success: true,
      });
      onOpenChange(false);
      setSelectedFolderId(null);
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Posts to PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folder-select">Select Folder to Export</Label>
            <Select
              value={selectedFolderId || "all"}
              onValueChange={(value) =>
                setSelectedFolderId(value === "all" ? null : value)
              }
            >
              <SelectTrigger id="folder-select">
                <SelectValue placeholder="Choose folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Posts ({getPostCount(null)} posts)
                </SelectItem>
                {filteredFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name} ({getPostCount(folder.id)} posts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFolderId !== null &&
            getPostCount(selectedFolderId) === 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  This folder is empty. No posts to export.
                </p>
              </div>
            )}

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-sm">Export Preview</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                Folder:{" "}
                <span className="font-medium">
                  {getFolderName(selectedFolderId)}
                </span>
              </p>
              <p>
                Posts:{" "}
                <span className="font-medium">
                  {getPostCount(selectedFolderId)} posts
                </span>
              </p>
              <p className="mt-2 text-xs">
                Each post will include: caption, hashtags, platform, and
                scheduling information.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer"
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 cursor-pointer"
              disabled={isExporting || getPostCount(selectedFolderId) === 0}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

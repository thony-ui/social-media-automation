"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface FolderDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  postCount: number;
  onConfirm: () => void;
}

export default function FolderDeleteConfirmDialog({
  open,
  onOpenChange,
  folderName,
  postCount,
  onConfirm,
}: FolderDeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription className="space-y-2">
            Are you sure you want to delete the folder{" "}
            <strong>&ldquo;{folderName}&rdquo;</strong>? This folder contains{" "}
            <strong>{postCount}</strong> post{postCount === 1 ? "" : "s"}. All
            posts will be moved to &ldquo;Ready to Schedule&rdquo; and remain
            available.
            <br />
            <span className="text-sm font-bold">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            Delete Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

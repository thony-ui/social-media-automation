"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface FolderEditModalProps {
  editingFolder: { id: string; name: string } | null;
  onClose: () => void;
  onSave: (folderId: string, newName: string) => void;
  onUpdateName: (name: string) => void;
}

export default function FolderEditModal({
  editingFolder,
  onClose,
  onSave,
  onUpdateName,
}: FolderEditModalProps) {
  const handleSave = () => {
    if (editingFolder?.name.trim()) {
      onSave(editingFolder.id, editingFolder.name.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={!!editingFolder} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>Enter a new name for the folder</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="folder-name"
            value={editingFolder?.name || ""}
            onChange={(e) => onUpdateName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Folder name"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editingFolder?.name.trim()}
            className="cursor-pointer"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

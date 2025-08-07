"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FolderPlus, X, Loader2 } from "lucide-react";
import { useCreateFolder } from "../hooks/mutations";
import { showToast } from "../utils/toast-helper";

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FOLDER_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

export default function CreateFolderModal({
  open,
  onOpenChange,
}: CreateFolderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6", // Default to blue
  });

  const createFolderMutation = useCreateFolder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const folderData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      color: formData.color,
    };

    try {
      await createFolderMutation.mutateAsync(folderData);
      showToast("Folder created successfully!", {
        success: true,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
      showToast("Failed to create folder", {
        success: false,
      });
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-500" />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Organize your posts by creating a new folder. You can group related
            content together.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name *</Label>
            <Input
              id="name"
              placeholder="Enter folder name..."
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full"
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.name.length} characters
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this folder is for..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="color">Folder Color</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: color.value }))
                  }
                  className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    formData.color === color.value
                      ? "border-gray-900 ring-2 ring-gray-300"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Selected color:{" "}
              {FOLDER_COLORS.find((c) => c.value === formData.color)?.name}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
              disabled={createFolderMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || createFolderMutation.isPending}
              className="cursor-pointer"
            >
              {createFolderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

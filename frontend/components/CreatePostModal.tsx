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
import { Badge } from "./ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { Post } from "../types";
import { useCreatePost } from "../hooks/mutations";
import { showToast } from "../utils/toast-helper";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost?: (post: Omit<Post, "id" | "createdAt">) => void; // Made optional since we're using the mutation
}

export default function CreatePostModal({
  open,
  onOpenChange,
}: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    caption: "",
    hashtags: "",
    imagePrompt: "",
    platform: "instagram",
  });

  const createPostMutation = useCreatePost();

  const platforms = [
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "twitter", name: "Twitter" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "tiktok", name: "TikTok" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caption.trim()) return;

    const postData = {
      caption: formData.caption.trim(),
      hashtags: formData.hashtags.trim() || undefined,
      imagePrompt: formData.imagePrompt.trim() || undefined,
      platform: formData.platform,
      status: "draft", // Default status
    };

    try {
      await createPostMutation.mutateAsync(postData);
      showToast("Post created successfully!", {
        success: true,
      });

      // Reset form
      setFormData({
        caption: "",
        hashtags: "",
        imagePrompt: "",
        platform: "instagram",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      // Error handling is done in the mutation hook
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      caption: "",
      hashtags: "",
      imagePrompt: "",
      platform: "instagram",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Create New Post
          </DialogTitle>
          <DialogDescription>
            Create a post manually with your own content and styling.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant={
                    formData.platform === platform.id ? "default" : "outline"
                  }
                  className="cursor-pointer transition-colors"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, platform: platform.id }))
                  }
                >
                  {platform.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              placeholder="Write your post caption here..."
              value={formData.caption}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, caption: e.target.value }))
              }
              className="min-h-[120px] resize-none"
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.caption.length} characters
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              placeholder="#marketing #socialmedia #content"
              value={formData.hashtags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, hashtags: e.target.value }))
              }
            />
          </div>

          {/* Image Prompt */}
          <div className="space-y-2">
            <Label htmlFor="imagePrompt">Image Description (Optional)</Label>
            <Textarea
              id="imagePrompt"
              placeholder="Describe the image you want to generate for this post..."
              value={formData.imagePrompt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imagePrompt: e.target.value,
                }))
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
              disabled={createPostMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.caption.trim() || createPostMutation.isPending
              }
              className="cursor-pointer"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Calendar, Image, Save, X } from "lucide-react";
import { Post } from "../types";

interface PostEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSave: (updatedPost: Post) => void;
}

export default function PostEditModal({
  open,
  onOpenChange,
  post,
  onSave,
}: PostEditModalProps) {
  const [formData, setFormData] = useState({
    caption: "",
    hashtags: "",
    imagePrompt: "",
    platform: "",
  });

  // Update form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        caption: post.caption || "",
        hashtags: post.hashtags || "",
        imagePrompt: post.imagePrompt || "",
        platform: post.platform || "",
      });
    }
  }, [post]);

  const handleSave = () => {
    if (!post) return;

    const updatedPost: Post = {
      ...post,
      caption: formData.caption,
      hashtags: formData.hashtags,
      imagePrompt: formData.imagePrompt,
      platform: formData.platform || "",
    };

    onSave(updatedPost);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form data to original values
    if (post) {
      setFormData({
        caption: post.caption || "",
        hashtags: post.hashtags || "",
        imagePrompt: post.imagePrompt || "",
        platform: post.platform || "",
      });
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Post
            <Badge className="text-xs">{post.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-medium">
              Caption
            </Label>
            <Textarea
              id="caption"
              placeholder="Write your post caption..."
              value={formData.caption}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
              className="min-h-[120px] resize-none"
            />
            <div className="text-xs text-gray-500">
              {formData.caption.length}/2200 characters
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags" className="text-sm font-medium">
              Hashtags
            </Label>
            <Textarea
              id="hashtags"
              placeholder="#example #hashtags #social"
              value={formData.hashtags}
              onChange={(e) =>
                setFormData({ ...formData, hashtags: e.target.value })
              }
              className="min-h-[80px] resize-none"
            />
            <div className="text-xs text-gray-500">
              Separate hashtags with spaces
            </div>
          </div>

          {/* Image Prompt */}
          <div className="space-y-2">
            <Label
              htmlFor="imagePrompt"
              className="text-sm font-medium flex items-center gap-1"
            >
              <Image className="w-4 h-4" />
              Image Idea
            </Label>
            <Textarea
              id="imagePrompt"
              placeholder="Describe the image you want to generate..."
              value={formData.imagePrompt}
              onChange={(e) =>
                setFormData({ ...formData, imagePrompt: e.target.value })
              }
              className="min-h-[80px] resize-none"
            />
            <div className="text-xs text-gray-500">
              Describe what kind of image would work best with this post
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium">
              Platform
            </Label>
            <Input
              id="platform"
              placeholder="Instagram, Twitter, LinkedIn, etc."
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            />
          </div>

          {/* Post Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {new Date(post.createdAt).toLocaleDateString()}
            </div>
            {post.scheduledAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Scheduled for {new Date(post.scheduledAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

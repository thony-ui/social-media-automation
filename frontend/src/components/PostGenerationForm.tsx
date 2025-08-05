"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { Post } from "@/types";
import { useCreatePostWithAi } from "@/hooks/mutations/useCreatePostWithAi";
import { showToast } from "@/utils/toast-helper";

interface PostGenerationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostGenerationForm({
  open,
  onOpenChange,
}: PostGenerationFormProps) {
  const [formData, setFormData] = useState({
    brandName: "",
    productDescription: "",
    targetAudience: "",
    numberOfPosts: 10,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const createPostWithAi = useCreatePostWithAi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      await createPostWithAi.mutateAsync(formData);
      showToast(`Generated ${formData.numberOfPosts} posts successfully!`, {
        success: true,
      });

      setFormData({
        brandName: "",
        productDescription: "",
        targetAudience: "",
        numberOfPosts: 10,
      });
    } catch (error) {
      console.error("Error generating posts:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate Posts with AI
          </DialogTitle>
          <DialogDescription>
            Let our AI create engaging social media content for your brand.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) =>
                setFormData({ ...formData, brandName: e.target.value })
              }
              placeholder="Your Brand Name"
              required
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">
              Product/Service Description
            </Label>
            <Textarea
              id="productDescription"
              value={formData.productDescription}
              onChange={(e) =>
                setFormData({ ...formData, productDescription: e.target.value })
              }
              placeholder="Describe what you're promoting..."
              required
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({ ...formData, targetAudience: e.target.value })
              }
              placeholder="Small business owners, age 25-45"
              required
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPosts">Number of Posts</Label>
            <Input
              id="numberOfPosts"
              type="number"
              min="1"
              max="10"
              value={formData.numberOfPosts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfPosts: parseInt(e.target.value) || 10,
                })
              }
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Posts
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

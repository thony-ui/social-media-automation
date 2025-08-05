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
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Save, X } from "lucide-react";
import { Post } from "../types";

interface PostScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSchedule: (postId: string, scheduledDate: string) => void;
  onUnschedule: (postId: string) => void;
}

export default function PostScheduleModal({
  open,
  onOpenChange,
  post,
  onSchedule,
  onUnschedule,
}: PostScheduleModalProps) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Update form data when post changes
  useEffect(() => {
    if (post && post.scheduledAt) {
      const date = new Date(post.scheduledAt);
      setScheduledDate(date.toISOString().split("T")[0]);
      setScheduledTime(date.toTimeString().slice(0, 5));
    } else {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setScheduledDate(tomorrow.toISOString().split("T")[0]);
      setScheduledTime("09:00");
    }
  }, [post]);

  const handleSchedule = () => {
    if (!post || !scheduledDate || !scheduledTime) return;

    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (dateTime <= now) {
      alert("Please select a future date and time.");
      return;
    }

    onSchedule(post.id, dateTime.toISOString());
    onOpenChange(false);
  };

  const handleUnschedule = () => {
    if (!post) return;
    onUnschedule(post.id);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isCurrentlyScheduled =
    post?.status === "scheduled" && post?.scheduledAt;

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Post
            <Badge className="text-xs">{post.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          {isCurrentlyScheduled && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Currently Scheduled</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {new Date(post.scheduledAt!).toLocaleString()}
              </p>
            </div>
          )}

          {/* Post Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Post Preview</h4>
            <p
              className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {post.caption}
            </p>
            {post.hashtags && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {post.hashtags}
              </p>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="cursor-pointer"
            />
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="cursor-pointer"
            />
          </div>

          {/* Timezone Info */}
          <div className="text-xs text-gray-500">
            <Clock className="w-3 h-3 inline mr-1" />
            Times are in your local timezone (
            {Intl.DateTimeFormat().resolvedOptions().timeZone})
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          {isCurrentlyScheduled && (
            <Button
              variant="outline"
              onClick={handleUnschedule}
              className="cursor-pointer text-orange-600 hover:text-orange-700"
            >
              <X className="w-4 h-4 mr-2" />
              Unschedule
            </Button>
          )}

          <Button onClick={handleSchedule} className="cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            {isCurrentlyScheduled ? "Reschedule" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Edit,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import PostEditModal from "./PostEditModal";
import PostScheduleModal from "./PostScheduleModal";
import PostDeleteConfirmDialog from "./PostDeleteConfirmDialog";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  onMove: (draggedId: string, targetId: string) => void;
  onEdit: (updatedPost: Post) => void;
  onSchedule: (postId: string, scheduledDate: string) => void;
  onUnschedule: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({
  post,
  onMove,
  onEdit,
  onSchedule,
  onUnschedule,
  onDelete,
}: PostCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "post",
    item: { id: post.id, type: "post" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "post",
    drop: (item: { id: string }) => {
      if (item.id !== post.id) {
        onMove(item.id, post.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className={`cursor-move transition-all duration-200 h-full ${
        isDragging ? "opacity-50 rotate-3 scale-105" : ""
      } ${isOver ? "scale-105 shadow-lg" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card
        className={`h-[400px] sm:h-[450px] lg:h-[480px] w-full flex flex-col hover:shadow-lg transition-all duration-200 ${
          isHovering ? "shadow-md transform -translate-y-1" : ""
        }`}
      >
        <CardHeader className="pb-2 sm:pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={getStatusColor(post.status)}
                  variant="secondary"
                >
                  {post.status}
                </Badge>
                {post.platform && (
                  <Badge variant="outline" className="text-xs">
                    {post.platform}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Created {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between overflow-hidden px-6">
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none pb-4">
            {/* Caption */}
            <div>
              <h4 className="font-medium text-sm mb-2">Caption</h4>
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <h4 className="font-medium text-sm mb-2">Hashtags</h4>
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm text-blue-600 line-clamp-2">
                  {post.hashtags}
                </p>
              </div>
            </div>

            {/* Image Prompt */}
            <div>
              {post.imagePrompt ? (
                <>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Image Idea
                  </h4>
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {post.imagePrompt}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center text-gray-400 text-xs py-4">
                  No image prompt
                </div>
              )}
            </div>

            {/* Scheduled Date */}
            <div>
              {post.scheduledAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">
                    Scheduled for{" "}
                    {new Date(post.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions - Always at bottom */}
          <div className="flex-shrink-0 space-y-2 pt-3 border-t">
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-3 h-3 mr-1" />
                <span className="hidden lg:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <Calendar className="w-3 h-3 mr-1" />
                <span className="hidden lg:inline">Schedule</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer px-2 sm:px-3"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* Generate Image Button */}
            {/* {post.imagePrompt && !post.imageUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer text-xs sm:text-sm"
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                Generate Image
              </Button>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <PostEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        post={post}
        onSave={onEdit}
      />

      {/* Schedule Modal */}
      <PostScheduleModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        post={post}
        onSchedule={onSchedule}
        onUnschedule={onUnschedule}
      />

      {/* Delete Confirmation Dialog */}
      <PostDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        postCaption={post.caption}
        onConfirm={() => onDelete(post.id)}
      />
    </div>
  );
}

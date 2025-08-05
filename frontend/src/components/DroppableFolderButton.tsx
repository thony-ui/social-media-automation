"use client";

import { useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderPlus, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { DragItem } from "@/types";

interface DroppableFolderButtonProps {
  folderId: string;
  folderName: string;
  postCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDropPost: (postId: string, folderId: string) => void;
}

export default function DroppableFolderButton({
  folderId,
  folderName,
  postCount,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDropPost,
}: DroppableFolderButtonProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "post",
    drop: (item: DragItem) => {
      if (item.type === "post") {
        onDropPost(item.id, folderId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`transition-all duration-200 ${
        isOver && canDrop
          ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-900/20 rounded-md"
          : ""
      }`}
    >
      <div className="flex items-center w-full">
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className="flex-1 justify-start min-w-0 cursor-pointer"
          onClick={onSelect}
        >
          <FolderPlus className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {folderName} ({postCount})
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0 ml-1 flex items-center justify-center cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isOver && canDrop && (
        <div className="text-xs text-blue-600 px-3 pb-1">
          Drop post here to add to folder
        </div>
      )}
    </div>
  );
}

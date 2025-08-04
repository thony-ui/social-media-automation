"use client";

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Post } from '@/types';

interface DraggablePostProps {
  post: Post;
  children: React.ReactNode;
}

interface DroppableItem {
  id: string;
  type: string;
}

export const DraggablePost: React.FC<DraggablePostProps> = ({ post, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'post',
    item: { id: post.id, type: 'post' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

interface DroppableSectionProps {
  onDrop: (item: DroppableItem) => void;
  dropType: string;
  children: React.ReactNode;
}

export const DroppableSection: React.FC<DroppableSectionProps> = ({
  onDrop,
  dropType,
  children,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'post',
    drop: (item: DroppableItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={`relative h-full ${
        isActive ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      } ${isOver && !canDrop ? 'bg-red-50 border-2 border-red-300 border-dashed' : ''}`}
    >
      {children}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-75 rounded-lg">
          <p className="text-blue-600 font-medium">
            {dropType === 'schedule' ? 'Drop here to schedule' : 'Drop here to unschedule'}
          </p>
        </div>
      )}
    </div>
  );
};

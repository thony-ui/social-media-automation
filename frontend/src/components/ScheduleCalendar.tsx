"use client";

import { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  GripVertical,
  Edit,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Post } from "@/types";
import PostScheduleModal from "./PostScheduleModal";
import PostEditModal from "./PostEditModal";
import {
  getCalendarDays,
  navigateMonth,
  getToday,
  isSameDay,
  isToday,
  setDateToTime,
  getTomorrow,
  formatTimeForDisplay,
  getMonthNames,
  getYearRange,
} from "@/utils/dateUtils";
import { usePostOperationsWithMutations } from "@/hooks/usePostOperationsWithMutations";

interface ScheduleCalendarProps {
  posts: Post[];
  toastFn?: (message: string, options?: { success?: boolean }) => void;
}

export default function ScheduleCalendar({
  posts,
  toastFn,
}: ScheduleCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingPostContent, setEditingPostContent] = useState<Post | null>(
    null
  );

  // Calendar state for month/year navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use the post operations hook
  const postOps = usePostOperationsWithMutations(posts, toastFn);

  const scheduledPosts = posts.filter(
    (post) => post.scheduledAt && post.status === "scheduled"
  );
  const draftPosts = posts.filter((post) => post.status === "draft");

  const getUpcomingPosts = () => {
    return scheduledPosts
      .sort(
        (a, b) =>
          new Date(a.scheduledAt!).getTime() -
          new Date(b.scheduledAt!).getTime()
      )
      .slice(0, 10);
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledAt!);
      return isSameDay(postDate, date);
    });
  };

  const handleMouseEnter = (date: Date, event: React.MouseEvent) => {
    setHoveredDate(date);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  // Handle dropping draft post to upcoming (schedule it)
  const handleScheduleDraftPost = (postId: string) => {
    // Schedule for tomorrow at 12 PM as default
    const tomorrow = setDateToTime(getTomorrow(), 12);
    postOps.handleSchedulePost(postId, tomorrow.toISOString());
  };

  // Handle dropping scheduled post to drafts (unschedule it)
  const handleUnschedulePost = (postId: string) => {
    postOps.handleUnschedulePost(postId);
  };

  // Month navigation handlers
  const handleNavigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, direction));
  };

  const handleGoToToday = () => {
    setCurrentDate(getToday());
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(monthIndex));
    setCurrentDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };

  // Droppable Area Component for sections
  const DroppableSection = ({
    children,
    onDrop,
    dropType,
  }: {
    children: React.ReactNode;
    onDrop: (postId: string) => void;
    dropType: string;
  }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "post",
      drop: (item: { id: string; type: string }) => {
        if (item.type === "post") {
          onDrop(item.id);
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
        className={`relative min-h-[400px] transition-all duration-200 ${
          isOver && canDrop
            ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50 rounded-lg"
            : ""
        }`}
      >
        {children}
        {isOver && canDrop && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/80 dark:bg-blue-900/40 rounded-lg z-10">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Drop to {dropType}
            </div>
          </div>
        )}
      </div>
    );
  };
  const DroppableCalendarDay = ({
    day,
    isCurrentMonth,
    date,
    hasPost,
  }: {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
    hasPost: boolean;
  }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "post",
      drop: (item: { id: string; type: string }) => {
        if (item.type === "post") {
          const newDate = new Date(date);
          newDate.setHours(12, 0, 0, 0); // Set to noon
          postOps.handleReschedulePost(item.id, newDate.toISOString());
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    const isCurrentDay = () => {
      return isToday(date);
    };

    return (
      <div
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className={`p-1 sm:p-2 h-12 sm:h-16 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 ${
          isCurrentMonth ? "text-gray-900" : "text-gray-300"
        } ${
          hasPost ? "bg-blue-100 text-blue-900 rounded-lg font-medium" : ""
        } ${
          isCurrentDay() ? "bg-blue-500 text-white rounded-lg font-bold" : ""
        } ${
          isOver && canDrop
            ? "bg-green-100 ring-2 ring-green-500 ring-opacity-50"
            : ""
        }`}
        onMouseEnter={(e) => handleMouseEnter(date, e)}
        onMouseLeave={handleMouseLeave}
      >
        <span className="text-xs sm:text-sm">{day}</span>
        {hasPost && !isCurrentDay() && (
          <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
        )}
        {isOver && canDrop && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-green-700 font-medium">
            <span className="hidden sm:inline">Drop here</span>
            <span className="sm:hidden">Drop</span>
          </div>
        )}
      </div>
    );
  };

  // Draggable Post Component
  const DraggablePost = ({
    post,
    children,
  }: {
    post: Post;
    children: React.ReactNode;
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "post",
      item: { id: post.id, type: "post" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag as unknown as React.Ref<HTMLDivElement>}
        className={`cursor-move transition-opacity ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {/* Upcoming Scheduled Posts */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Upcoming Posts
          </CardTitle>
        </CardHeader>
        <DroppableSection onDrop={handleScheduleDraftPost} dropType="schedule">
          <CardContent className="space-y-4 h-full flex flex-col">
            {getUpcomingPosts().length > 0 ? (
              <div className="space-y-4 flex-1">
                {getUpcomingPosts().map((post) => (
                  <DraggablePost key={post.id} post={post}>
                    <div className="border rounded-lg p-2 sm:p-3 space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <Badge variant="outline" className="text-xs">
                            {post.platform || "All Platforms"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {new Date(post.scheduledAt!).toLocaleDateString()}{" "}
                              at{" "}
                              {formatTimeForDisplay(
                                new Date(post.scheduledAt!)
                              )}
                            </span>
                            <span className="sm:hidden">
                              {new Date(post.scheduledAt!).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPost(post);
                              }}
                              className="w-4 h-4 !cursor-pointer"
                            />

                            <Edit
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPostContent(post);
                              }}
                              className="w-4 h-4 !cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm line-clamp-2">
                        {post.caption}
                      </p>
                      <p className="text-xs text-blue-600 line-clamp-1">
                        {post.hashtags}
                      </p>
                    </div>
                  </DraggablePost>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No posts scheduled yet</p>
                <p className="text-sm">
                  Schedule your first post to see it here
                </p>
                <p className="text-xs mt-2 text-blue-600">
                  💡 Tip: Drag draft posts here to schedule them
                </p>
              </div>
            )}
          </CardContent>
        </DroppableSection>
      </Card>

      {/* Draft Posts Ready to Schedule */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Ready to Schedule
          </CardTitle>
        </CardHeader>
        <DroppableSection onDrop={handleUnschedulePost} dropType="unschedule">
          <CardContent className="space-y-4 h-full flex flex-col">
            {draftPosts.length > 0 ? (
              <div className="space-y-4 flex-1">
                {draftPosts.slice(0, 5).map((post) => (
                  <DraggablePost key={post.id} post={post}>
                    <div className="border rounded-lg p-2 sm:p-3 space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <Badge className="text-xs">Draft</Badge>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="text-xs text-gray-500">
                            <span className="hidden sm:inline">Created </span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPost(post);
                              }}
                              className="w-4 h-4 !cursor-pointer"
                            />

                            <Edit
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPostContent(post);
                              }}
                              className="w-4 h-4 !cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm line-clamp-2">
                        {post.caption}
                      </p>
                      <p className="text-xs text-blue-600 line-clamp-1">
                        {post.hashtags}
                      </p>
                    </div>
                  </DraggablePost>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No draft posts available</p>
                <p className="text-sm">Generate some posts first</p>
                <p className="text-xs mt-2 text-blue-600">
                  💡 Tip: Drag scheduled posts here to unschedule them
                </p>
              </div>
            )}
          </CardContent>
        </DroppableSection>
      </Card>

      {/* Calendar View - Interactive Month View */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-lg font-semibold">Calendar View</span>

            {/* Mobile-first navigation */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Month/Year Row */}
              <div className="flex items-center justify-center gap-2">
                {/* Previous Month Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigateMonth("prev")}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Month Dropdown */}
                <Select
                  value={currentDate.getMonth().toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getMonthNames().map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year Dropdown */}
                <Select
                  value={currentDate.getFullYear().toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-22 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearRange(currentDate.getFullYear()).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Next Month Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigateMonth("next")}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Today Button - Full width on mobile, inline on desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToToday}
                className="text-sm font-medium h-8 px-4 w-full sm:w-auto"
              >
                Today
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm">
            {/* Calendar Header */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="font-medium text-gray-500 p-1 sm:p-2 text-xs sm:text-sm"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {getCalendarDays(currentDate).map((calendarDay, i) => {
              const hasPost = getPostsForDate(calendarDay.date).length > 0;

              return (
                <DroppableCalendarDay
                  key={i}
                  day={calendarDay.day}
                  isCurrentMonth={calendarDay.isCurrentMonth}
                  date={calendarDay.date}
                  hasPost={hasPost}
                />
              );
            })}
          </div>

          {/* Tooltip for posts on hovered date */}
          {hoveredDate && getPostsForDate(hoveredDate).length > 0 && (
            <div
              className="fixed z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3 max-w-xs"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: "translateY(-100%)",
              }}
            >
              <h4 className="font-medium text-sm mb-2">
                Posts on {hoveredDate.toLocaleDateString()}
              </h4>
              <div className="space-y-2">
                {getPostsForDate(hoveredDate).map((post) => (
                  <div key={post.id} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {post.platform}
                      </Badge>
                      <span className="text-gray-500">
                        {formatTimeForDisplay(new Date(post.scheduledAt!))}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-gray-700">
                      {post.caption.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Schedule Modal for editing schedule */}
      {editingPost && (
        <PostScheduleModal
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          post={editingPost}
          onSchedule={postOps.handleSchedulePost}
          onUnschedule={postOps.handleUnschedulePost}
        />
      )}

      {/* Post Edit Modal for editing content */}
      {editingPostContent && (
        <PostEditModal
          open={!!editingPostContent}
          onOpenChange={(open) => !open && setEditingPostContent(null)}
          post={editingPostContent}
          onSave={(updatedPost) => {
            postOps.handleEditPost(updatedPost);
            setEditingPostContent(null);
          }}
        />
      )}
    </div>
  );
}

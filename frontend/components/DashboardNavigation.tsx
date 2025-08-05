"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Calendar, LogOut } from "lucide-react";
import { ViewType } from "../types";
import { signOut } from "../lib/auth";

interface DashboardNavigationProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function DashboardNavigation({
  selectedView,
  onViewChange,
}: DashboardNavigationProps) {
  const handleLogout = async () => {
    await signOut();
  };

  const navigationItems = [
    {
      id: "posts" as ViewType,
      label: "Content Studio",
      description: "Create, organize, and manage your posts",
      icon: Sparkles,
      color: "from-blue-500 to-purple-600",
      activeColor: "bg-blue-500",
    },
    {
      id: "schedule" as ViewType,
      label: "Schedule & Calendar",
      description: "Plan and schedule your content",
      icon: Calendar,
      color: "from-green-500 to-teal-600",
      activeColor: "bg-green-500",
    },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedView === item.id;

          return (
            <Card
              key={item.id}
              className={`py-0 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                isSelected
                  ? "ring-1 ring-blue-500 shadow-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                  : "hover:ring-1 hover:ring-gray-200"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <div className="px-2 py-[12px]">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded bg-gradient-to-r ${item.color}`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Mobile: show shorter labels */}
                  <span
                    className={`text-xs font-medium whitespace-nowrap sm:hidden ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.id === "posts" ? "Posts" : "Schedule"}
                  </span>
                  {isSelected && (
                    <div
                      className={`w-1 h-1 rounded-full ${item.activeColor} flex-shrink-0`}
                    ></div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-1 sm:gap-2 text-gray-600 cursor-pointer hover:bg-transparent px-2 sm:px-4"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}

/**
 * Calendar and date utility functions
 */

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  date: Date;
}

/**
 * Gets an array of month names for dropdown
 */
export const getMonthNames = (): string[] => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
};

/**
 * Gets an array of years for dropdown (current year ± 5 years)
 */
export const getYearRange = (currentYear?: number): number[] => {
  const baseYear = currentYear || new Date().getFullYear();
  const years = [];
  for (let year = baseYear - 5; year <= baseYear + 5; year++) {
    years.push(year);
  }
  return years;
};

/**
 * Sets a date to a specific month and year
 */
export const setDateToMonthYear = (month: number, year: number): Date => {
  return new Date(year, month, 1);
};

/**
 * Generates calendar days for a given month and year
 * Returns a 42-cell grid (6 weeks × 7 days) with proper previous/next month overflow
 */
export const getCalendarDays = (currentDate: Date): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // First day of the week (0 = Sunday)
  const startDate = firstDay.getDay();
  // Number of days in the month
  const daysInMonth = lastDay.getDate();

  // Calculate days from previous month to show
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Calculate total cells needed (6 rows * 7 days = 42)
  const totalCells = 42;

  const days: CalendarDay[] = [];

  // Previous month days
  for (let i = startDate - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false,
      date: new Date(year, month, day),
    });
  }

  // Next month days
  const remainingCells = totalCells - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true,
      date: new Date(year, month + 1, day),
    });
  }

  return days;
};

/**
 * Navigates to the previous or next month
 */
export const navigateMonth = (
  currentDate: Date,
  direction: "prev" | "next"
): Date => {
  const newDate = new Date(currentDate);
  if (direction === "prev") {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  return newDate;
};

/**
 * Returns a new Date object set to today
 */
export const getToday = (): Date => {
  return new Date();
};

/**
 * Formats a date to display month and year (e.g., "August 2025")
 */
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Checks if two dates are the same day (ignoring time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

/**
 * Creates a new date with a specific time (useful for scheduling)
 */
export const setDateToTime = (
  date: Date,
  hours: number,
  minutes: number = 0
): Date => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Gets tomorrow's date
 */
export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

/**
 * Formats a date for display in tooltips or UI
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats time for display (e.g., "2:30 PM")
 */
export const formatTimeForDisplay = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

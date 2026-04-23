import { differenceInCalendarDays, isToday } from "date-fns";

export type Priority = "low" | "medium" | "high";
export type Category = "study" | "personal" | "work";
export type Status = "pending" | "completed";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  priority: Priority;
  category: Category;
  status: Status;
  is_habit: boolean;
  streak: number;
  last_completed_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const computeSmartPriority = (deadline: Date | null): Priority => {
  if (!deadline) return "low";
  if (isToday(deadline) || deadline < new Date()) return "high";
  const diff = differenceInCalendarDays(deadline, new Date());
  if (diff <= 2) return "medium";
  return "low";
};

export const priorityColor = (p: Priority) => {
  switch (p) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-warning/10 text-warning border-warning/20";
    case "low": return "bg-success/10 text-success border-success/20";
  }
};

export const categoryColor = (c: Category) => {
  switch (c) {
    case "study": return "bg-primary/10 text-primary border-primary/20";
    case "work": return "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400";
    case "personal": return "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400";
  }
};

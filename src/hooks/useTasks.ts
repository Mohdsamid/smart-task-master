import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/lib/tasks";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { toast } from "sonner";

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setTasks((data ?? []) as Task[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const toggleComplete = async (task: Task) => {
    if (!user) return;
    const completing = task.status === "pending";
    const today = format(new Date(), "yyyy-MM-dd");
    let newStreak = task.streak;
    if (completing && task.is_habit) {
      if (task.last_completed_date) {
        const last = new Date(task.last_completed_date);
        const diff = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
        newStreak = diff === 1 ? task.streak + 1 : diff === 0 ? task.streak : 1;
      } else {
        newStreak = 1;
      }
    }
    const update: any = {
      status: completing ? "completed" : "pending",
      completed_at: completing ? new Date().toISOString() : null,
    };
    if (completing && task.is_habit) {
      update.streak = newStreak;
      update.last_completed_date = today;
    }
    const { error } = await supabase.from("tasks").update(update).eq("id", task.id);
    if (error) { toast.error(error.message); return; }

    if (completing) {
      // Award points
      const { data: prof } = await supabase.from("profiles").select("points").eq("id", user.id).maybeSingle();
      const pts = (prof?.points ?? 0) + (task.priority === "high" ? 15 : task.priority === "medium" ? 10 : 5);
      await supabase.from("profiles").update({ points: pts }).eq("id", user.id);
      toast.success(`✨ +${pts - (prof?.points ?? 0)} points!`);
    }
    fetchTasks();
  };

  const deleteTask = async (task: Task) => {
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    if (error) toast.error(error.message);
    else { toast.success("Task deleted"); fetchTasks(); }
  };

  return { tasks, loading, fetchTasks, toggleComplete, deleteTask };
};

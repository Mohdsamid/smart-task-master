import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { FocusMode } from "@/components/FocusMode";
import { Task } from "@/lib/tasks";
import { isToday, format, startOfDay, subDays, isAfter } from "date-fns";
import { CheckCircle2, ListTodo, Target, TrendingUp, Plus, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const { tasks, fetchTasks, toggleComplete, deleteTask } = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const dueToday = tasks.filter(t => t.deadline && isToday(new Date(t.deadline)) && t.status === "pending");
    const completedToday = tasks.filter(t => t.completed_at && isToday(new Date(t.completed_at)));
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;
    const habits = tasks.filter(t => t.is_habit).sort((a, b) => b.streak - a.streak);

    const weekly = Array.from({ length: 7 }).map((_, i) => {
      const day = startOfDay(subDays(new Date(), 6 - i));
      const count = tasks.filter(t => t.completed_at &&
        startOfDay(new Date(t.completed_at)).getTime() === day.getTime()).length;
      return { day: format(day, "EEE"), completed: count };
    });

    return { dueToday, completedToday, total, rate, habits, weekly };
  }, [tasks]);

  const upcoming = tasks
    .filter(t => t.status === "pending" && t.deadline && isAfter(new Date(t.deadline), new Date()))
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const cards = [
    { icon: Target, label: "Due today", value: stats.dueToday.length, color: "text-warning" },
    { icon: CheckCircle2, label: "Done today", value: stats.completedToday.length, color: "text-success" },
    { icon: ListTodo, label: "Total tasks", value: stats.total, color: "text-primary" },
    { icon: TrendingUp, label: "Completion", value: `${stats.rate}%`, color: "text-purple-500" },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Welcome back 👋</h2>
          <p className="text-muted-foreground text-sm">Here's your productivity at a glance</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="shadow-glow">
          <Plus className="w-4 h-4 mr-1" /> New task
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <Card key={i} className="p-5 transition-base hover:shadow-elegant border animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-3xl font-bold">{c.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6 border">
          <h3 className="font-semibold mb-4">Weekly progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekly}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Top streaks</h3>
          {stats.habits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No habits yet. Mark a task as daily habit!</p>
          ) : (
            <div className="space-y-3">
              {stats.habits.slice(0, 5).map(h => (
                <div key={h.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium truncate">{h.title}</span>
                  <span className="text-sm font-bold text-orange-500 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {h.streak}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Due today</h3>
          <div className="space-y-3">
            {stats.dueToday.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground border">All clear for today! 🎉</Card>
            ) : stats.dueToday.map(t => (
              <TaskCard key={t.id} task={t} onToggle={toggleComplete}
                onEdit={(t) => { setEditing(t); setOpen(true); }}
                onDelete={deleteTask} onFocus={setFocusTask} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground border">Nothing coming up.</Card>
            ) : upcoming.map(t => (
              <TaskCard key={t.id} task={t} onToggle={toggleComplete}
                onEdit={(t) => { setEditing(t); setOpen(true); }}
                onDelete={deleteTask} onFocus={setFocusTask} />
            ))}
          </div>
        </div>
      </div>

      <TaskDialog open={open} onOpenChange={setOpen} task={editing} onSaved={fetchTasks} />
      <FocusMode task={focusTask} onClose={() => setFocusTask(null)} onComplete={toggleComplete} />
    </AppLayout>
  );
};

export default Dashboard;

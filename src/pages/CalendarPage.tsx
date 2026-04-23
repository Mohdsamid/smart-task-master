import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { FocusMode } from "@/components/FocusMode";
import { Task } from "@/lib/tasks";
import { isSameDay, format } from "date-fns";

const CalendarPage = () => {
  const { tasks, fetchTasks, toggleComplete, deleteTask } = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  const dayTasks = tasks.filter(t => t.deadline && date && isSameDay(new Date(t.deadline), date));
  const tasksWithDeadlines = tasks.filter(t => t.deadline).map(t => new Date(t.deadline!));

  return (
    <AppLayout>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Calendar</h2>
      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        <Card className="p-4 border h-fit">
          <Calendar
            mode="single" selected={date} onSelect={setDate}
            modifiers={{ hasTask: tasksWithDeadlines }}
            modifiersClassNames={{ hasTask: "font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary" }}
            className="rounded-md"
          />
        </Card>
        <div>
          <h3 className="font-semibold mb-3">
            {date ? format(date, "EEEE, MMMM d") : "Select a date"}
          </h3>
          <div className="space-y-3">
            {dayTasks.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border">No tasks on this day.</Card>
            ) : dayTasks.map(t => (
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

export default CalendarPage;

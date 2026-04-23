import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { FocusMode } from "@/components/FocusMode";
import { Task } from "@/lib/tasks";
import { Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Tasks = () => {
  const { tasks, fetchTasks, toggleComplete, deleteTask } = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "completed">("pending");
  const [category, setCategory] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (status !== "all" && t.status !== status) return false;
      if (category !== "all" && t.category !== category) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
          !(t.description ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, status, category, priority, search]);

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">All tasks</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="shadow-glow">
          <Plus className="w-4 h-4 mr-1" /> New task
        </Button>
      </div>

      <Card className="p-4 mb-6 border">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Tabs value={status} onValueChange={(v: any) => setStatus(v)} className="mt-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <Card className="md:col-span-2 p-12 text-center text-muted-foreground border">
            No tasks match your filters.
          </Card>
        ) : filtered.map(t => (
          <TaskCard key={t.id} task={t} onToggle={toggleComplete}
            onEdit={(t) => { setEditing(t); setOpen(true); }}
            onDelete={deleteTask} onFocus={setFocusTask} />
        ))}
      </div>

      <TaskDialog open={open} onOpenChange={setOpen} task={editing} onSaved={fetchTasks} />
      <FocusMode task={focusTask} onClose={() => setFocusTask(null)} onComplete={toggleComplete} />
    </AppLayout>
  );
};

export default Tasks;

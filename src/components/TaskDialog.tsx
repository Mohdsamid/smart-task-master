import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Task, Priority, Category, computeSmartPriority } from "@/lib/tasks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(1, "Title required").max(120),
  description: z.string().max(1000).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task?: Task | null;
  onSaved: () => void;
}

export const TaskDialog = ({ open, onOpenChange, task, onSaved }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [category, setCategory] = useState<Category>("personal");
  const [isHabit, setIsHabit] = useState(false);
  const [autoPrio, setAutoPrio] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setDeadline(task.deadline ? task.deadline.slice(0, 16) : "");
      setPriority(task.priority);
      setCategory(task.category);
      setIsHabit(task.is_habit);
      setAutoPrio(false);
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const defaultDeadline = now.toISOString().slice(0, 16);
      setTitle(""); setDescription(""); setDeadline(defaultDeadline); setPriority("high");
      setCategory("personal"); setIsHabit(false); setAutoPrio(true);
    }
  }, [task, open]);

  useEffect(() => {
    if (autoPrio && deadline) {
      setPriority(computeSmartPriority(new Date(deadline)));
    }
  }, [deadline, autoPrio]);

  const handleSave = async () => {
    if (!user) return;
    const parsed = schema.safeParse({ title, description });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSaving(true);
    const payload = {
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      priority, category, is_habit: isHabit,
    };
    const { error } = task
      ? await supabase.from("tasks").update(payload).eq("id", task.id)
      : await supabase.from("tasks").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(task ? "Task updated" : "Task created");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Optional details..." />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: Priority) => { setPriority(v); setAutoPrio(false); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">Daily habit</Label>
              <p className="text-xs text-muted-foreground">Track streak when completed daily</p>
            </div>
            <Switch checked={isHabit} onCheckedChange={setIsHabit} />
          </div>
          {deadline && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm">Smart priority</Label>
                <p className="text-xs text-muted-foreground">Auto-set from deadline</p>
              </div>
              <Switch checked={autoPrio} onCheckedChange={setAutoPrio} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

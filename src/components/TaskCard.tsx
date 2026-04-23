import { Task, priorityColor, categoryColor } from "@/lib/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Flame, Pencil, Trash2, Timer } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onFocus: (t: Task) => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete, onFocus }: Props) => {
  const completed = task.status === "completed";
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const overdue = deadline && !completed && isPast(deadline) && !isToday(deadline);
  const dueToday = deadline && !completed && isToday(deadline);

  return (
    <Card className={cn(
      "p-4 transition-base hover:shadow-elegant border group animate-scale-in",
      completed && "opacity-60",
      overdue && "border-destructive/40"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox checked={completed} onCheckedChange={() => onToggle(task)} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn("font-semibold leading-snug", completed && "line-through")}>{task.title}</h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-base">
              {!completed && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onFocus(task)} title="Focus">
                  <Timer className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(task)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDelete(task)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            <Badge variant="outline" className={priorityColor(task.priority)}>{task.priority}</Badge>
            <Badge variant="outline" className={categoryColor(task.category)}>{task.category}</Badge>
            {task.is_habit && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400 gap-1">
                <Flame className="w-3 h-3" /> {task.streak}d
              </Badge>
            )}
            {deadline && (
              <span className={cn("text-xs flex items-center gap-1",
                overdue ? "text-destructive font-medium" : dueToday ? "text-warning font-medium" : "text-muted-foreground"
              )}>
                {dueToday ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {format(deadline, "MMM d, h:mm a")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

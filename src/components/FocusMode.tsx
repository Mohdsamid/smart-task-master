import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/tasks";
import { Pause, Play, RotateCcw, Check } from "lucide-react";

interface Props {
  task: Task | null;
  onClose: () => void;
  onComplete: (t: Task) => void;
}

const DURATION = 25 * 60;

export const FocusMode = ({ task, onClose, onComplete }: Props) => {
  const [seconds, setSeconds] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (task) { setSeconds(DURATION); setRunning(true); setDone(false); }
  }, [task]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setRunning(false);
          setDone(true);
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 880; g.gain.value = 0.1;
            o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 500);
          } catch {}
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const progress = ((DURATION - seconds) / DURATION) * 100;

  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Focus session</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task?.title}</p>
          <div className="relative w-48 h-48 mx-auto my-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold tabular-nums">{mins}:{secs}</span>
            </div>
          </div>
          {done ? (
            <div className="space-y-3 animate-fade-in">
              <p className="font-medium text-success">🎉 Session complete!</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => { setSeconds(DURATION); setDone(false); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Restart
                </Button>
                <Button onClick={() => { if (task) onComplete(task); onClose(); }}>
                  <Check className="w-4 h-4 mr-2" /> Mark done
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setSeconds(DURATION)}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button onClick={() => setRunning(r => !r)} className="min-w-32">
                {running ? <><Pause className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />Resume</>}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

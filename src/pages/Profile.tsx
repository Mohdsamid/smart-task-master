import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useTasks } from "@/hooks/useTasks";
import { Trophy, Mail, User as UserIcon, CheckCircle2, ListTodo, Flame } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setName(data.name ?? ""); setPoints(data.points); }
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const completed = tasks.filter(t => t.status === "completed").length;
  const totalStreak = tasks.filter(t => t.is_habit).reduce((s, t) => s + t.streak, 0);

  return (
    <AppLayout>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Profile</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6 border text-center">
          <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-glow">
            {name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
          </div>
          <h3 className="font-bold text-lg">{name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary font-semibold">
            <Trophy className="w-4 h-4" /> {points} points
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 border">
          <h3 className="font-semibold mb-4">Account details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><UserIcon className="w-3.5 h-3.5" /> Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
          </div>
        </Card>

        <Card className="p-5 border">
          <ListTodo className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Total tasks</p>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </Card>
        <Card className="p-5 border">
          <CheckCircle2 className="w-5 h-5 text-success mb-2" />
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-3xl font-bold">{completed}</p>
        </Card>
        <Card className="p-5 border">
          <Flame className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-sm text-muted-foreground">Total streak days</p>
          <p className="text-3xl font-bold">{totalStreak}</p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;

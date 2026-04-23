import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, Calendar, User, LogOut, Sparkles, Moon, Sun, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks", icon: ListTodo, label: "Tasks" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [points, setPoints] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("points").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setPoints(data.points); });
    const channel = supabase.channel("profile-points")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        (payload) => setPoints((payload.new as any).points))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar shrink-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">SmartTask</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-base",
              isActive ? "bg-primary text-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={async () => { await signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">SmartTask</span>
          </div>
          <h1 className="hidden md:block font-semibold text-lg capitalize">
            {location.pathname.replace("/", "") || "Dashboard"}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5"><Trophy className="w-3.5 h-3.5 text-warning" />{points} pts</Badge>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-card/95 backdrop-blur-sm flex justify-around p-2">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-xs font-medium transition-base",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

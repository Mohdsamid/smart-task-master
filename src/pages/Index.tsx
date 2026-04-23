import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import {
  CheckCircle2, Sparkles, Timer, Flame, BarChart3, Calendar,
  ArrowRight, Shield, Zap, Target, GraduationCap, Github, Mail, Code2, Rocket
} from "lucide-react";

const features = [
  { icon: CheckCircle2, title: "Smart Tasks", desc: "Auto-prioritized by deadline. Categories, filters, and tags built in." },
  { icon: Timer, title: "Focus Mode", desc: "25-min Pomodoro sessions to crush deep work, one task at a time." },
  { icon: Flame, title: "Habits & Streaks", desc: "Build daily habits and watch your streak grow day after day." },
  { icon: BarChart3, title: "Productivity Stats", desc: "Weekly charts and completion rates so you see real progress." },
  { icon: Calendar, title: "Calendar View", desc: "See what's due, when. Plan your week with confidence." },
  { icon: Sparkles, title: "Gamified", desc: "Earn points for every completed task. Level up your day." },
];

const stats = [
  { value: "25min", label: "Focus sessions" },
  { value: "3", label: "Smart priorities" },
  { value: "∞", label: "Habit streaks" },
  { value: "100%", label: "Free forever" },
];

const steps = [
  { icon: Target, title: "Capture", desc: "Add tasks with deadlines, categories, and details in seconds." },
  { icon: Zap, title: "Prioritize", desc: "Smart engine ranks what's urgent so you never miss a deadline." },
  { icon: Rocket, title: "Execute", desc: "Focus mode + streaks keep you in flow until it's done." },
];

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">SmartTask</span>
        </div>
        <div className="flex gap-2">
          {user ? (
            <Button asChild><Link to="/dashboard">Dashboard</Link></Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Log in</Link></Button>
              <Button asChild className="shadow-glow"><Link to="/auth?mode=signup">Get started</Link></Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-16 md:py-28 text-center animate-fade-in relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6 glow-border">
          <Sparkles className="w-3.5 h-3.5" /> Your productivity, reimagined
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Manage tasks. <span className="text-gradient">Build habits.</span><br />Get things done.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A clean, smart task manager with focus sessions, streak tracking, and a productivity dashboard — all in one beautiful place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="shadow-glow">
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
              Start free <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground">Three steps from chaos to clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Card key={i} className="p-6 gradient-card border-border/50 relative overflow-hidden">
              <div className="absolute top-3 right-4 text-6xl font-bold text-primary/10">{i + 1}</div>
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need</h2>
          <p className="text-muted-foreground">Powerful features wrapped in a delightful interface.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card key={i} className="p-6 transition-base hover:shadow-elegant hover:-translate-y-1 gradient-card border-border/50">
              <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
              <Shield className="w-3.5 h-3.5" /> Built for students & creators
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed to keep you in the zone.</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              SmartTask blends a beautiful dark UI with smart automation: deadlines auto-set urgency,
              the Pomodoro timer guards your focus, and streaks reward consistency. No clutter, no friction —
              just momentum.
            </p>
            <ul className="space-y-3">
              {[
                "Auto-priority engine based on deadline proximity",
                "Daily habits with streak tracking & celebrations",
                "Distraction-free 25-minute focus sessions",
                "Weekly stats to visualize your real progress",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-8 gradient-card border-border/50 shadow-elegant">
            <div className="space-y-4">
              {[
                { c: "bg-destructive", t: "Submit DBMS assignment", b: "Today · High" },
                { c: "bg-warning", t: "Read 30 pages", b: "Habit · 12-day streak 🔥" },
                { c: "bg-primary", t: "Project proposal review", b: "Tomorrow · Medium" },
                { c: "bg-success", t: "Morning workout", b: "Completed · +10 pts" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/40">
                  <div className={`w-2 h-10 rounded-full ${row.c}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{row.t}</div>
                    <div className="text-xs text-muted-foreground">{row.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Developer / About */}
      <section className="container py-16">
        <Card className="p-8 md:p-12 gradient-card border-border/50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <div className="w-32 h-32 mx-auto md:mx-0 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-16 h-16 text-primary-foreground" />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-medium mb-3">
                <Code2 className="w-3.5 h-3.5" /> About the developer
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Built by a BCA student</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                SmartTask is a final-year project crafted by a <span className="text-foreground font-medium">BCA 6th Semester</span> student
                at <span className="text-foreground font-medium">IPS College, Chhindwara (M.P.)</span>. Designed and developed end-to-end —
                from database schema to the last pixel — with a focus on clean code, modern design, and real-world usefulness.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">React</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">Tailwind CSS</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">PostgreSQL</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">Supabase</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <Card className="gradient-hero p-10 md:p-16 text-center border-border/50 shadow-elegant relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">Ready to be more productive?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join SmartTask and turn your to-do list into your done list.
          </p>
          <Button size="lg" asChild className="shadow-glow">
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>Get started — it's free</Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8">
        <div className="container py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SmartTask</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A productivity companion built with love. Helping students and creators turn intent into action,
              one focused session at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth?mode=signup" className="hover:text-foreground transition-base">Get started</Link></li>
              <li><Link to="/auth" className="hover:text-foreground transition-base">Sign in</Link></li>
              <li><a href="#" className="hover:text-foreground transition-base">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Developer</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> BCA 6th Sem</li>
              <li className="flex items-center gap-2"><Code2 className="w-4 h-4" /> IPS College, Chhindwara</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> Madhya Pradesh, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50">
          <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartTask. Built with care as a BCA final project.</p>
            <p>IPS College, Chhindwara (M.P.)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

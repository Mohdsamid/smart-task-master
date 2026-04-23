import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { CheckCircle2, Sparkles, Timer, Flame, BarChart3, Calendar, ArrowRight } from "lucide-react";

const features = [
  { icon: CheckCircle2, title: "Smart Tasks", desc: "Auto-prioritized by deadline. Categories, filters, and tags built in." },
  { icon: Timer, title: "Focus Mode", desc: "25-min Pomodoro sessions to crush deep work, one task at a time." },
  { icon: Flame, title: "Habits & Streaks", desc: "Build daily habits and watch your streak grow day after day." },
  { icon: BarChart3, title: "Productivity Stats", desc: "Weekly charts and completion rates so you see real progress." },
  { icon: Calendar, title: "Calendar View", desc: "See what's due, when. Plan your week with confidence." },
  { icon: Sparkles, title: "Gamified", desc: "Earn points for every completed task. Level up your day." },
];

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">SmartTask</span>
        </div>
        <div className="flex gap-2">
          {user ? (
            <Button asChild><Link to="/dashboard">Dashboard</Link></Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Log in</Link></Button>
              <Button asChild><Link to="/auth?mode=signup">Get started</Link></Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-16 md:py-28 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6">
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
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card key={i} className="p-6 transition-base hover:shadow-elegant hover:-translate-y-1 border">
              <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <Card className="gradient-hero p-10 md:p-16 text-center text-white border-0 shadow-elegant">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to be more productive?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join SmartTask and turn your to-do list into your done list.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>Get started — it's free</Link>
          </Button>
        </Card>
      </section>

      <footer className="container py-8 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} SmartTask. Built with care.
      </footer>
    </div>
  );
};

export default Index;

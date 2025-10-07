import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, Brain, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudySync
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-20">
          <div className="inline-block animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
            Your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Smart Notebook
            </span>
            <br />
            Powered by AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Take notes, organize your thoughts, and get AI-powered summaries. 
            StudySync helps you learn smarter, not harder.
          </p>
          
          <div className="flex gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 h-12"
            >
              Start Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 h-12"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
            <p className="text-muted-foreground">
              Tag, search, and organize your notes with ease. Never lose track of your ideas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Summaries</h3>
            <p className="text-muted-foreground">
              Get instant AI-powered summaries of your notes to save time and boost productivity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Quick note creation, instant search, and seamless syncing across all your devices.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;

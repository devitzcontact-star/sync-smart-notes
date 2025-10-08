import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, Moon, Sun, User as UserIcon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export const DashboardHeader = ({ user, onSignOut }: DashboardHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudySync
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Your Smart Notebook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/public-notes")}
            title="View Public Notes"
            className="rounded-lg"
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            title="Profile"
            className="rounded-lg"
          >
            <UserIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="gap-2 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

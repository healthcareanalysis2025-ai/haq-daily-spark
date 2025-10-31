import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Calendar as CalendarIcon, LogOut, BarChart3 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useUser } from "@/context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { useState } from "react";

interface DashboardProps {
  userName: string;
  completedDays: string[]; // Now stores date strings in YYYY-MM-DD format
  attemptedDays: string[]; // Store attempted but not completed days
  onDayClick: (date: string) => void;
  onViewStats?: () => void;
}

export const Dashboard = ({
  userName,
  completedDays,
  attemptedDays,
  onDayClick,
  onViewStats,
}: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const totalDays = 15;
  const progress = (completedDays.length / totalDays) * 100;
  const { userId, loginEmail, loginDate, loginTime } = useUser();
  console.log("Logged in user:", loginEmail, "date :", loginDate, "  Time :", loginTime);
  const navigate = useNavigate();

  const handleEmailProgress = () => {
    toast.success("Progress summary sent to your email!");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error during logout");
    }
  };


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const dateString = format(date, "yyyy-MM-dd");
      onDayClick(dateString);
    }
  };

  const isDateCompleted = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return completedDays.includes(dateString);
  };

  const isDateAttempted = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return attemptedDays.includes(dateString);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-10 w-10 object-contain" />
            <h1 className="text-lg md:text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ</h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden md:flex gap-6 items-center">
              <Link to="/technology" className="nav-link text-sm">
                Technology
              </Link>
              <Link to="/about" className="nav-link text-sm">
                About Us
              </Link>
            </nav>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Welcome back, <span className="text-primary">{userName}</span>!
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Continue your learning journey and track your progress
            </p>
          </div>

        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md border border-border mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <CalendarIcon className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your Progress</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {onViewStats && (
                <Button
                  variant="outline"
                  onClick={onViewStats}
                  className="gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">View Stats</span>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleEmailProgress}
                className="gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email Progress</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 mb-8 p-5 bg-muted/40 rounded-lg border border-border/50">
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-muted-foreground font-medium">Completed Queries</span>
              <span className="font-bold text-primary text-lg">
                {completedDays.length} / {totalDays}
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-xs text-muted-foreground text-right font-medium">
              {Math.round(progress)}% Complete
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
              Select a Day to Attempt
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Click any date on the calendar to start or review that day's query
            </p>
            <div className="flex justify-center bg-muted/30 p-6 rounded-lg border border-border/50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-lg border-0 shadow-sm bg-card"
                modifiers={{
                  completed: (date) => isDateCompleted(date),
                  attempted: (date) => isDateAttempted(date) && !isDateCompleted(date),
                }}
                modifiersClassNames={{
                  completed: "bg-success text-success-foreground font-bold hover:bg-success/90",
                  attempted: "bg-accent text-accent-foreground font-semibold hover:bg-accent/90",
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
            Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="w-14 h-14 bg-success rounded-lg flex items-center justify-center font-bold text-success-foreground text-xl shadow-sm">
                ✓
              </div>
              <span className="text-sm md:text-base font-medium">Completed Query</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center font-bold text-primary text-xl shadow-sm">
                ~
              </div>
              <span className="text-sm md:text-base font-medium">Attempted (Not Completed)</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

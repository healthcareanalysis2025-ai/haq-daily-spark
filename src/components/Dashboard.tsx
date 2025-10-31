import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Calendar as CalendarIcon, LogOut, BarChart3 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
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
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-10" />
            <h1 className="text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ (HAQ)</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Welcome, {userName}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Your learning journey is underway
            </p>
          </div>

        <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-primary" />
              <h2 className="text-2xl font-semibold">Your Progress</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {onViewStats && (
                <Button
                  variant="outline"
                  onClick={onViewStats}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Stats
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleEmailProgress}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Progress
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed Queries:</span>
              <span className="font-semibold text-primary">
                {completedDays.length}/{totalDays}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">
              Select a Day to Attempt
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click any date on the calendar to start or review that day's query
            </p>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border shadow-sm"
                modifiers={{
                  completed: (date) => isDateCompleted(date),
                  attempted: (date) => isDateAttempted(date) && !isDateCompleted(date),
                }}
                modifiersClassNames={{
                  completed: "bg-success text-success-foreground font-bold",
                  attempted: "bg-accent text-accent-foreground font-semibold",
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center font-bold text-success-foreground">
                ✓
              </div>
              <span className="text-sm">Completed Query</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center font-bold">
                ~
              </div>
              <span className="text-sm">Attempted (Not Completed)</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

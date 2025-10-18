import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface DashboardProps {
  userName: string;
  completedDays: number[];
  currentDay: number;
  onDayClick: (day: number) => void;
}

export const Dashboard = ({
  userName,
  completedDays,
  currentDay,
  onDayClick,
}: DashboardProps) => {
  const totalDays = 15;
  const progress = (completedDays.length / totalDays) * 100;

  const handleEmailProgress = () => {
    toast.success("Progress summary sent to your email!");
  };

  const getDayStatus = (day: number) => {
    if (completedDays.includes(day)) return "completed";
    if (day === currentDay) return "active";
    return "locked";
  };

  const getDayClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground cursor-not-allowed";
      case "active":
        return "bg-accent text-accent-foreground cursor-pointer hover:scale-110 transition-transform animate-pulse-success";
      case "locked":
        return "bg-muted text-muted-foreground cursor-not-allowed";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" />
              <h2 className="text-2xl font-semibold">Your Progress</h2>
            </div>
            <Button
              variant="outline"
              onClick={handleEmailProgress}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Progress
            </Button>
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

          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const status = getDayStatus(day);
              const isClickable = status === "active";

              return (
                <button
                  key={day}
                  onClick={() => isClickable && onDayClick(day)}
                  disabled={!isClickable}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center
                    font-semibold text-lg shadow-md
                    ${getDayClasses(status)}
                  `}
                  title={
                    status === "completed"
                      ? "Completed"
                      : status === "active"
                      ? "Click to start today's query"
                      : "Locked"
                  }
                >
                  <span className="text-xs opacity-75 mb-1">Day</span>
                  <span>{day}</span>
                  {status === "completed" && (
                    <span className="text-xs mt-1">✓</span>
                  )}
                  {status === "locked" && (
                    <span className="text-xs mt-1">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center font-bold">
                {currentDay}
              </div>
              <span className="text-sm">Today's Query (Active)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center font-bold text-success-foreground">
                ✓
              </div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold">
                🔒
              </div>
              <span className="text-sm">Locked (Future)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

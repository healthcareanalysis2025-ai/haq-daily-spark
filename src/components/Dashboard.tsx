import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail,Calendar, LogOut } from "lucide-react";
//import Calendar from "react-calendar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useUser } from "../context/UserContext";
import { BASE_URL } from "@/config";
import { useNavigate } from "react-router-dom";

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
  const { userId,loginEmail,loginDate,loginTime } = useUser();
  console.log("Logged in user:", loginEmail, "date :", loginDate,"  Time :",loginTime);
  const navigate = useNavigate();

  const handleEmailProgress = () => {
    toast.success("Progress summary sent to your email!");
  };

  const handleLogout = async () => {
  try {
    //const res = await fetch("https://mite-kind-neatly.ngrok-free.app/webhook-test/logOut", {
    const res = await fetch(`${BASE_URL}/logOut`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Logged out successfully");
      // Optionally clear local state
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      window.location.reload(); // optional: ensures Index re-runs useEffect
    } else {
      toast.error("Logout failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error during logout");
  }
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
              // Temporarily force all days to active
              const status: "completed" | "active" | "locked" = "active";
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
          title="Active (temporarily enabled)"
        >
          <span className="text-xs opacity-75 mb-1">Day</span>
          <span>{day}</span>
          {/*{status === "completed" && <span className="text-xs mt-1">✓</span>}
          {status === "locked" && <span className="text-xs mt-1">🔒</span>} */}
        </button>
      );
      })}
  </div>

        {/*  <div className="grid grid-cols-5 gap-4">
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
          </div> */}
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
    </div>
  );
};

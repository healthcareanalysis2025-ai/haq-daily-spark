import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Calendar as CalendarIcon, LogOut, BarChart3, XCircle, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useUser } from "@/context/UserContext";
import { useNavigate, Link } from "react-router-dom";
// import { format, addDays, differenceInDays } from "date-fns";
import { useState,useEffect } from "react";
import { BASE_URL } from "@/config";



// import { format, addDays, differenceInDays, isBefore, isEqual } from "date-fns";

//import { format, addDays, differenceInDays, startOfDay,isBefore } from "date-fns";

import { addDays, startOfDay, differenceInDays, format, isBefore } from "date-fns";
import { ProgressStats } from "./ProgressStats";

function generateDayStatuses(signUpDate: string, attemptedDays: string[]) {
  const today = startOfDay(new Date());
  const start = startOfDay(new Date(signUpDate));
  const diff = differenceInDays(today, start);
  const statuses = [];

  const hasAttempts = Array.isArray(attemptedDays) && attemptedDays.length > 0;

  for (let i = 0; i <= diff + 7; i++) {
    const date = startOfDay(addDays(start, i));
    const dateStr = format(date, "yyyy-MM-dd");

    let status = "";
    let clickable = false;

    if (date > today) {
      // Future dates
      status = "future";
      clickable = false;
    } else if (hasAttempts && attemptedDays.includes(dateStr)) {
      // Already attempted
      status = "completed";
      clickable = false;
    } else if (date.getTime() === today.getTime()) {
      // Today — always clickable unless already attempted
      status = "today";
      clickable = !(hasAttempts && attemptedDays.includes(dateStr));
    } else if (!hasAttempts && isBefore(date, today) && isBefore(start, date)) {
      // If no attempts at all — mark all past days as missed
      status = "missed";
      clickable = false;
    } else if (hasAttempts && isBefore(date, today) && !attemptedDays.includes(dateStr)) {
      // Missed some days (not in attempted list)
      status = "missed";
      clickable = false;
    } else {
      // Default fallback
      status = "missed";
      clickable = false;
    }

    statuses.push({ date: dateStr, status, clickable });
  }

  return statuses;
}

interface DashboardProps {
  userName: string;
  completedDays: string[]; // Now stores date strings in YYYY-MM-DD format
  attemptedDays: string[]; // Store attempted but not completed days
  // total_attemptedDays:number;
  // missed_dates:string[];
  // missed_no_days:number;
  onDayClick: (date: string) => void;
  onViewStats?: () => void;
}

export const Dashboard = ({
  userName,
  completedDays,
  attemptedDays,
  //total_attemptedDays,missed_dates,missed_no_days,
  onDayClick,
  onViewStats,
}: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // const totalDays = 15;
  // const progress = (completedDays.length / totalDays) * 100;

  const [totalDays, setTotalDays] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [missedDaysCount, setMissedDaysCount] = useState<number>(0);

  const { userId, loginEmail, loginDate, loginTime } = useUser();

  console.log("Logged in user:", loginEmail, "date :", loginDate, "  Time :", loginTime+" Userid "+userId+" completed days");
  const [dayStatuses, setDayStatuses] = useState<{ date: string; status: string; clickable: boolean }[]>([]);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardProps | null>(null);
console.log("******DASHBOARD*********");
console.log(completedDays);
  useEffect(() => {
  const fetchUserDays = async () => {
    try {
      // Example: GET request to n8n endpoint
      const res = await fetch(`${BASE_URL}/getAttemptedDays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({user_id:userId}), //  send key-value data
    });

      if (!res.ok) throw new Error("Failed to fetch user days");

      const data = await res.json();

      // Expected response format:
      // { signup_date: "2025-10-29", attemptedDays: ["2025-10-29", "2025-11-05"] }

      console.log("Fetched data from n8n:", data);

      const { signup_date, attemptedDays } = data[0];
      console.log("Signup date:", signup_date);
      
      if (!signup_date) {
        toast.error("No signup date found for user.");
        return;
      }

      // 2️⃣ Generate all dates from signup → today (inclusive)
      const allDates: string[] = [];
      let currentDate = new Date(signup_date);

      while (currentDate <= new Date(loginDate)) {
        allDates.push(currentDate.toISOString().split("T")[0]); // format YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1); // move to next day
      }
      
      // Filter out null or invalid entries
      const cleanAttemptedDays = Array.isArray(attemptedDays)
        ? attemptedDays.filter(d => d && typeof d === "string")
        : [];

      console.log("Signup date:", signup_date);
      console.log("Clean attempted days:", cleanAttemptedDays);
      
      const missedDays = allDates.filter(date => !cleanAttemptedDays.includes(date));
      console.log("All Dates:", allDates);
      
      console.log("Missed Days:", missedDays);
      setMissedDaysCount(missedDays.length);
      
      // 1️⃣ Difference between signup date & current date
      const today = new Date();
      const signup = new Date(signup_date);

      const diffTime = today.getTime() - signup.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))+1;
      const attemptedCount = cleanAttemptedDays.length;
      console.log("Attempted days count:", attemptedCount);
      
      
      if(diffDays > 15){
        setTotalDays(diffDays);
        setProgress((attemptedCount / diffDays) * 100);
      } else {
        setTotalDays(15);
        setProgress((attemptedCount / 15) * 100);
      }
      console.log("Days since signup:", diffDays);

     
      

      

      setDashboardData(prev => ({
  ...prev,
  completedDays: cleanAttemptedDays,
  attemptedDays:cleanAttemptedDays,
  total_attemptedDays:attemptedCount,
  missed_dates:missedDays,
  missed_no_days:missedDays.length
}));



      const statuses = generateDayStatuses(signup_date, cleanAttemptedDays);
      setDayStatuses(statuses); // if you’re storing it in state

      
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      toast.error("Unable to load calendar data.");
    }
  };

  if (userId) {
    fetchUserDays();
  }
}, [userId]);




  const handleEmailProgress = () => {
    console.log(dashboardData);
    toast.success("Progress summary sent to your email!");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDateSelect = (date: Date | undefined) => {
  if (!date) return;

  const dateStr = format(date, "yyyy-MM-dd");
  const selectedStatus = dayStatuses.find(d => d.date === dateStr);

  if (!selectedStatus) return;

  if (selectedStatus.clickable) {
    setSelectedDate(date);
    onDayClick(dateStr);
  } else {
    toast.error(
      selectedStatus.status === "future"
        ? "Future challenges are locked!"
        : "You can only attempt today's challenge!"
    );
  }
};

// Disable all non-clickable days
const isDateDisabled = (date: Date) => {
  const dateStr = format(date, "yyyy-MM-dd");
  const status = dayStatuses.find(d => d.date === dateStr);
  return status ? !status.clickable : true;
};


  const handleDateSelectOld = (date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDay = new Date(date);
      selectedDay.setHours(0, 0, 0, 0);
      
      // Only allow selecting today's date
      if (selectedDay.getTime() === today.getTime()) {
        setSelectedDate(date);
        const dateString = format(date, "yyyy-MM-dd");
        onDayClick(dateString);
      } else {
        toast.error("You can only attempt today's challenge!");
      }
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
                {dashboardData?.completedDays?.length} / {totalDays}
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-xs text-muted-foreground text-right font-medium">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Challenge Status Card */}
          <div className="mb-8">
            {missedDaysCount > 0 ? (
              <div className="flex items-center gap-5 p-5 bg-destructive/10 rounded-xl border-2 border-destructive/30 shadow-md hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-destructive/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-9 h-9 text-destructive" />
                </div>
                <div>
                  <p className="text-lg font-bold text-destructive">
                    Missed ({missedDaysCount} {missedDaysCount === 1 ? 'Day' : 'Days'})
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Catch up on missed challenges to stay on track
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5 p-5 bg-success/10 rounded-xl border-2 border-success/30 shadow-md hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-9 h-9 text-success" />
                </div>
                <div>
                  <p className="text-lg font-bold text-success">
                    Completed All Days
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Great job staying consistent!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
              Attempt Today's Challenge
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Click on today's date to attempt the daily challenge
            </p>
            <div className="flex justify-center bg-muted/30 p-6 rounded-lg border border-border/50">
              {/*
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-lg border-0 shadow-sm bg-card"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const checkDate = new Date(date);
                  checkDate.setHours(0, 0, 0, 0);
                  // Disable all dates except today
                  return checkDate.getTime() !== today.getTime();
                }}
                modifiers={{
                  completed: (date) => isDateCompleted(date),
                  attempted: (date) => isDateAttempted(date) && !isDateCompleted(date),
                }}
                modifiersClassNames={{
                  completed: "bg-success text-success-foreground font-bold hover:bg-success/90",
                  attempted: "bg-accent text-accent-foreground font-semibold hover:bg-accent/90",
                }}
              /> */}
              <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-lg border-0 shadow-sm bg-card"
                  disabled={isDateDisabled}
                  modifiers={{
                    completed: (date) =>
                      dayStatuses.some(d => d.date === format(date, "yyyy-MM-dd") && d.status === "completed"),
                    missed: (date) =>
                      dayStatuses.some(d => d.date === format(date, "yyyy-MM-dd") && d.status === "missed"),
                    today: (date) =>
                      dayStatuses.some(d => d.date === format(date, "yyyy-MM-dd") && d.status === "today"),
                  }}
                  modifiersClassNames={{
                    completed: "bg-success text-success-foreground font-bold hover:bg-success/90",
                    missed: "bg-destructive/70 text-destructive-foreground font-semibold hover:bg-destructive/80",
                    today: "bg-primary text-primary-foreground font-bold hover:bg-primary/90",
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
              <div className="w-14 h-14 bg-destructive/70 rounded-lg flex items-center justify-center font-bold text-destructive-foreground text-xl shadow-sm">
                ✗
              </div>
              <span className="text-sm md:text-base font-medium">Missed Challenge</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

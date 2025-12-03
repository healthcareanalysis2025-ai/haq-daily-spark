import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { TechnologySelection } from "@/components/TechnologySelection";
import { Dashboard } from "@/components/Dashboard";
import { QueryPage } from "@/components/QueryPage";
import { CertificatePage } from "@/components/CertificatePage";
import { CompletionPage } from "@/components/CompletionPage";
import { ProgressStats } from "@/components/ProgressStats";
import Technology from "./Technology";

interface UserData {
  name: string;
  track: string;
  batchCode: string;
  technology?: "sql" | "python";
  tech_id?: number;
}

type View = "login" | "techSelection" | "dashboard" | "query" | "certificate" | "completion" | "stats" | "technology";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [attemptedDays, setAttemptedDays] = useState<string[]>([]);
  const [missedDays, setMissedDays] = useState<string[]>([]);
  const [techScore, setTechScore] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Load data from localStorage on mount and listen for logout
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("haq_user");
      const savedCompleted = localStorage.getItem("haq_completed");
      const savedAttempted = localStorage.getItem("haq_attempted");

      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData(user);
        
        // Check if technology is selected
        if (user.technology) {
          setCurrentView("dashboard");
        } else {
          setCurrentView("techSelection");
        }
      } else {
        setCurrentView("login");
        setUserData(null);
        setCompletedDays([]);
        setAttemptedDays([]);
        setMissedDays([]);
      }
      
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }
      if (savedAttempted) {
        setAttemptedDays(JSON.parse(savedAttempted));
      }
      
      setIsAuthChecking(false);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (including logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "haq_user" || e.key === null) {
        // key is null when localStorage.clear() is called
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for logout within same tab
    const handleLogout = () => {
      setCurrentView("login");
      setUserData(null);
      setCompletedDays([]);
      setAttemptedDays([]);
      setMissedDays([]);
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  // Check if certificate eligibility: minimum 15 days completed AND 70% score
  useEffect(() => {
    if (completedDays.length >= 15 && attemptedDays.length > 0) {
      const score = (completedDays.length / attemptedDays.length) * 100;
      if (score >= 70 && currentView !== "certificate") {
        setCurrentView("certificate");
      }
    }
  }, [completedDays, attemptedDays, currentView]);

  const handleLogin = (name: string, track: string, batchCode: string) => {
    const user = { name, track, batchCode };
    setUserData(user);
    localStorage.setItem("haq_user", JSON.stringify(user));
    setCurrentView("techSelection");
  };
  
  const handleTechnologySelect = (technology: "sql" | "python") => {
    if (userData) {
      console.log("technology selected:", technology);
      const techMap: Record<"sql" | "python", number> = {
        sql: 1,
        python: 2,
      };
      
      
      const tech_id = techMap[technology]; 
      console.log("tech_id:", tech_id);
      const updatedUser = { ...userData, technology, tech_id };
      console.log("Inside index file Technology Selection Updated User:", updatedUser);
      setUserData(updatedUser);
      localStorage.setItem("haq_user", JSON.stringify(updatedUser));
      setCurrentView("dashboard");
    }
  };

  

  const handleDayClick = (dateString: string) => {
    setSelectedDay(dateString);
    setCurrentView("query");
  };

  const handleQueryComplete = (dateString: string) => {
    const newCompleted = [...completedDays, dateString];
    const newAttempted = [...attemptedDays, dateString];
    
    setCompletedDays(newCompleted);
    setAttemptedDays(newAttempted);
    
    localStorage.setItem("haq_completed", JSON.stringify(newCompleted));
    localStorage.setItem("haq_attempted", JSON.stringify(newAttempted));
    
    setTimeout(() => {
      setCurrentView("completion");
    }, 2000);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedDay(null);
  };

  const handleBackToTechSelection = () => {
    setCurrentView("techSelection");
    setSelectedDay(null);
  };

  const handleViewStats = (missed: string[] = [], totalDaysCount: number = 15, completed: string[] = [], attempted: string[] = [], score: number = 0) => {
    setMissedDays(missed);
    setCompletedDays(completed);
    setAttemptedDays(attempted);
    setTechScore(score);
    setCurrentView("stats");
  };

  const handleBackFromStats = () => {
    setCurrentView("dashboard");
  };

  const handleReset = () => {
    localStorage.removeItem("haq_user");
    localStorage.removeItem("haq_completed");
    localStorage.removeItem("haq_attempted");
    setUserData(null);
    setCompletedDays([]);
    setAttemptedDays([]);
    setCurrentView("login");
  };

  // Show loading while checking auth
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentView === "techSelection" && userData) {
    return <TechnologySelection onSelect={handleTechnologySelect} />;
  }

  if (currentView === "technology") {
    console.log("from index file technology view userData:", userData);
    return <Technology 
            
            onSelect={handleTechnologySelect} />;
  }

  if (currentView === "query" && selectedDay && userData) {
    return (
      <QueryPage
        userData={userData}
        day={selectedDay}
        technology={userData.technology || "sql"}
        onBack={handleBackToDashboard}
        onComplete={handleQueryComplete}
        hasAttempted={attemptedDays.includes(selectedDay)}
      />
    );
  }

  if (currentView === "certificate" && userData) {
    return (
      <CertificatePage
        userName={userData.name}
        track={userData.track}
        batchCode={userData.batchCode}
        onReset={handleReset}
      />
    );
  }

  if (currentView === "completion" && selectedDay) {
    return (
      <CompletionPage
        day={selectedDay}
        onBackToDashboard={handleBackToDashboard}
        onBackToTechSelection={handleBackToTechSelection}
      />
    );
  }

  if (currentView === "stats" && userData) {
    const totalDaysForStats = attemptedDays.length > 15 ? attemptedDays.length : 15;
    return (
      <ProgressStats
        userName={userData.name}
        completedDays={completedDays}
        attemptedDays={attemptedDays}
        missedDays={missedDays}
        totalDays={totalDaysForStats}
        technology={userData.technology || "sql"}
        score={techScore}
        onBack={handleBackFromStats}
      />
    );
  }

  if (currentView === "dashboard" && userData) {
    return (
      <Dashboard
        userData={userData}
        completedDays={completedDays}
        attemptedDays={attemptedDays}
        technology={userData.technology || "sql"}
        onDayClick={handleDayClick}
        onViewStats={handleViewStats}
      />
    );
  }

  return null;
};

export default Index;

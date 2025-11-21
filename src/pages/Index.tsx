import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { TechnologySelection } from "@/components/TechnologySelection";
import { Dashboard } from "@/components/Dashboard";
import { QueryPage } from "@/components/QueryPage";
import { CertificatePage } from "@/components/CertificatePage";
import { CompletionPage } from "@/components/CompletionPage";
import { ProgressStats } from "@/components/ProgressStats";

interface UserData {
  name: string;
  track: string;
  batchCode: string;
  technology?: "sql" | "python";
}

type View = "login" | "techSelection" | "dashboard" | "query" | "certificate" | "completion" | "stats";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [attemptedDays, setAttemptedDays] = useState<string[]>([]);
  const [missedDays, setMissedDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
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
    }
    
    if (savedCompleted) {
      setCompletedDays(JSON.parse(savedCompleted));
    }
    if (savedAttempted) {
      setAttemptedDays(JSON.parse(savedAttempted));
    }
    
    setIsAuthChecking(false);
  }, []);

  // Check if all queries are completed
  useEffect(() => {
    if (completedDays.length === 15) {
      setCurrentView("certificate");
    }
  }, [completedDays]);

  const handleLogin = (name: string, track: string, batchCode: string) => {
    const user = { name, track, batchCode };
    setUserData(user);
    localStorage.setItem("haq_user", JSON.stringify(user));
    setCurrentView("techSelection");
  };

  const handleTechnologySelect = (technology: "sql" | "python") => {
    if (userData) {
      const updatedUser = { ...userData, technology };
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

  const handleViewStats = (missed: string[] = []) => {
    setMissedDays(missed);
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

  if (currentView === "query" && selectedDay && userData) {
    return (
      <QueryPage
        day={selectedDay}
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
    return (
      <ProgressStats
        userName={userData.name}
        completedDays={completedDays}
        attemptedDays={attemptedDays}
        missedDays={missedDays}
        onBack={handleBackFromStats}
      />
    );
  }

  if (currentView === "dashboard" && userData) {
    return (
      <Dashboard
        userName={userData.name}
        completedDays={completedDays}
        attemptedDays={attemptedDays}
        onDayClick={handleDayClick}
        onViewStats={handleViewStats}
      />
    );
  }

  return null;
};

export default Index;

import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { QueryPage } from "@/components/QueryPage";
import { CertificatePage } from "@/components/CertificatePage";

interface UserData {
  name: string;
  track: string;
  batchCode: string;
}

type View = "login" | "dashboard" | "query" | "certificate";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [attemptedDays, setAttemptedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Current day is October 17, 2025 (day 1)
  const currentDay = 1;

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("haq_user");
    const savedCompleted = localStorage.getItem("haq_completed");
    const savedAttempted = localStorage.getItem("haq_attempted");

    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setCurrentView("dashboard");
    }
    if (savedCompleted) {
      setCompletedDays(JSON.parse(savedCompleted));
    }
    if (savedAttempted) {
      setAttemptedDays(JSON.parse(savedAttempted));
    }
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
    setCurrentView("dashboard");
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setCurrentView("query");
  };

  const handleQueryComplete = (day: number) => {
    const newCompleted = [...completedDays, day];
    const newAttempted = [...attemptedDays, day];
    
    setCompletedDays(newCompleted);
    setAttemptedDays(newAttempted);
    
    localStorage.setItem("haq_completed", JSON.stringify(newCompleted));
    localStorage.setItem("haq_attempted", JSON.stringify(newAttempted));
    
    setTimeout(() => {
      setCurrentView("dashboard");
      setSelectedDay(null);
    }, 2000);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedDay(null);
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

  if (currentView === "login") {
    return <LoginPage onLogin={handleLogin} />;
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

  if (currentView === "dashboard" && userData) {
    return (
      <Dashboard
        userName={userData.name}
        completedDays={completedDays}
        currentDay={currentDay}
        onDayClick={handleDayClick}
      />
    );
  }

  return null;
};

export default Index;

import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { TechnologySelection } from "@/components/TechnologySelection";
import { Dashboard } from "@/components/Dashboard";
import { QueryPage } from "@/components/QueryPage";
import { CertificatePage } from "@/components/CertificatePage";
import { CompletionPage } from "@/components/CompletionPage";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  name: string;
  track: string;
  batchCode: string;
  technology?: "sql" | "python";
}

type View = "login" | "techSelection" | "dashboard" | "query" | "certificate" | "completion";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [attemptedDays, setAttemptedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Current day is October 17, 2025 (day 1)
  const currentDay = 1;

  // Check authentication and load data
  useEffect(() => {
    // Check for active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // User is authenticated, load their data
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
          // Has session but no user data, stay on login to complete profile
          setCurrentView("login");
        }
        
        if (savedCompleted) {
          setCompletedDays(JSON.parse(savedCompleted));
        }
        if (savedAttempted) {
          setAttemptedDays(JSON.parse(savedAttempted));
        }
      } else {
        // No session, show login
        setCurrentView("login");
      }
      setIsAuthChecking(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserData(null);
        setCurrentView("login");
      }
    });

    return () => subscription.unsubscribe();
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
      setCurrentView("completion");
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

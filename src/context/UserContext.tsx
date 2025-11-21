import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userId: number | null;
  setuserId: (userId: number) => void;
  loginEmail: string | null;
  setLoginEmail: (loginEmail: string) => void;
  loginTime: string | null;
  setLoginTime: (time: string) => void;
  loginDate: string | null;
  setLoginDate: (date: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage
  const [userId, setUserIdState] = useState<number | null>(() => {
    const saved = localStorage.getItem("haq_userId");
    return saved ? parseInt(saved) : null;
  });
  const [loginEmail, setLoginEmailState] = useState<string | null>(() => {
    return localStorage.getItem("haq_loginEmail") || null;
  });
  const [loginTime, setLoginTimeState] = useState<string | null>(() => {
    return localStorage.getItem("haq_loginTime") || null;
  });
  const [loginDate, setLoginDateState] = useState<string | null>(() => {
    return localStorage.getItem("haq_loginDate") || null;
  });

  // Wrapper functions that save to localStorage
  const setuserId = (id: number) => {
    setUserIdState(id);
    localStorage.setItem("haq_userId", id.toString());
  };

  const setLoginEmail = (email: string) => {
    setLoginEmailState(email);
    localStorage.setItem("haq_loginEmail", email);
  };

  const setLoginTime = (time: string) => {
    setLoginTimeState(time);
    localStorage.setItem("haq_loginTime", time);
  };

  const setLoginDate = (date: string) => {
    setLoginDateState(date);
    localStorage.setItem("haq_loginDate", date);
  };

  return (
    <UserContext.Provider value={{ userId, setuserId, loginEmail, setLoginEmail, loginTime, setLoginTime, loginDate, setLoginDate }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

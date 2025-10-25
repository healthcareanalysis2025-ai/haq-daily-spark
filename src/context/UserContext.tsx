import { createContext, useContext, useState, ReactNode } from "react";

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
  const [userId, setuserId] = useState<number | null>(null);
  const [loginEmail, setLoginEmail] = useState<string | null>(null);
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [loginDate, setLoginDate] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId,setuserId, loginEmail, setLoginEmail, loginTime, setLoginTime, loginDate, setLoginDate }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

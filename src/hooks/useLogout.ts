import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/config";

export const useLogout = () => {
  const navigate = useNavigate();
  const { userId, loginDate, loginTime, setuserId, setLoginEmail, setLoginDate, setLoginTime, userLogId, setUserLogId, setOverallScore } = useUser();

  const logout = async () => {
    try {

    const userDate=new Date().toLocaleDateString("en-CA");
    const userTime = new Date().toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
      // Call backend logout endpoint
      if (userId && loginDate && loginTime) {
        await fetch(`${BASE_URL}/logOut`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            user_id: userId, 
            userDate: userDate, 
            userTime: userTime,
            userLogId:userLogId 
          })
        });
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    }
    
    // Always clear client-side data after logout request completes
    localStorage.removeItem("haq_user");
    localStorage.removeItem("haq_auth");
    localStorage.removeItem("haq_completed");
    localStorage.removeItem("haq_attempted");
    sessionStorage.clear();
    
    // Reset user context
    setuserId(null);
    setLoginEmail(null);
    setLoginDate(null);
    setLoginTime(null);
    setUserLogId(null);
    setOverallScore(null);
    
    // Dispatch custom logout event for Index component
    window.dispatchEvent(new Event("logout"));
    
    toast.success("Logged out successfully!!!");
    
    // Navigate to login page
    navigate("/");
  };

  return { logout };
};

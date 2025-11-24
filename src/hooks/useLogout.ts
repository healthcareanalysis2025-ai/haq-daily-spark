import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/config";

export const useLogout = () => {
  const navigate = useNavigate();
  const { userId, loginDate, loginTime, setuserId, setLoginEmail, setLoginDate, setLoginTime } = useUser();

  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint
      if (userId && loginDate && loginTime) {
        await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            user_id: userId, 
            userDate: loginDate, 
            userTime: loginTime 
          })
        }).catch(err => {
          console.warn("Backend logout failed:", err);
        });
      }
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear client-side data regardless of backend response
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset user context
      setuserId(null);
      setLoginEmail(null);
      setLoginDate(null);
      setLoginTime(null);
      
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return { logout };
};

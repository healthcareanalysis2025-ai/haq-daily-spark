import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ninjaLogo from "@/assets/ninja-logo.png";
import ninjaSpinner from "@/assets/ninja-spinner.png";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/config";
import { useLogout } from "@/hooks/useLogout";
import { getCurrentDate, getCurrentTime } from "../utils/datetime";

interface LoginPageProps {
  onLogin: (name: string, track: string, batchCode: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [track, setTrack] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setuserId, setLoginEmail, setLoginDate, setLoginTime,setUserLogId } = useUser();
  const { logout } = useLogout();

  const handleSignUp = async () => {
  if (!name || !track || !batchCode || !email || !password) {
    toast({
      title: "Missing information",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  if (password.length < 6) {
    toast({
      title: "Password too short",
      description: "Password must be at least 6 characters",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  // DUMMY LOGIN - Backend disabled temporarily
  /*
  try {
    toast({
      title: "Account created!",
      description: "You can now proceed with your learning journey.",
    });

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];
    
    setuserId(Math.floor(Math.random() * 10000)); // Dummy user ID
    setLoginEmail(email);
    setLoginDate(date);
    setLoginTime(time);

    // Auto-login after signup
    onLogin(name, track, batchCode);
  } catch (error: any) {
    console.error("Error during signup:", error);
  }
*/
  /* BACKEND N8N CALL*/
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLocal_dateTime=getCurrentDate()+" "+getCurrentTime();
    
    const payload = {
      name: name,
      track: track,
      batch_code: batchCode,
      email: email,
      password: password,
      zone: timezone,
      userLocal_dateTime:userLocal_dateTime
    };

    const res = await fetch(`${BASE_URL}/signUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json();
    
    if(data.success === "true"){
      toast({
        title: "Account created!",
        description: "Logging you in...",
      });

      // Auto-login after successful signup to get user data
      const userDate = new Date().toLocaleDateString("en-CA");
      const userTime = new Date().toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });

      const loginPayload = {
        email: email,
        password: password,
        userDate: userDate,
        userTime: userTime
      };

      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
        signal: AbortSignal.timeout(10000),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        
        if (loginData.status === "success" && loginData.user) {
          // Set UserContext values
          setuserId(loginData.user.user_id);
          setLoginEmail(email);
          setLoginDate(userDate);
          setLoginTime(userTime);
          setUserLogId(loginData.user_log_id);
          
          onLogin(name, track, batchCode);
        } else {
          // Fallback: proceed without full user context
          onLogin(name, track, batchCode);
        }
      } else {
        // Fallback: proceed without full user context
        onLogin(name, track, batchCode);
      }
    } else {
      toast({
        title: data.message || "Sign up failed",
        description: "Please try with a different email",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Error during signup:", error);
    
    let errorMessage = "Unable to connect to the backend server";
    let errorDescription = "Please ensure the backend service is running and accessible";
    
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      errorMessage = "Connection timeout";
      errorDescription = "The backend server is taking too long to respond";
    } else if (error.message?.includes('Failed to fetch')) {
      errorMessage = "Backend not accessible";
      errorDescription = "Cannot reach the backend server. Please check if the backend URL is correct and the service is running.";
    }
    
    toast({
      title: errorMessage,
      description: errorDescription,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
  
};

  const handleLogin = async () => {
  if (!email || !password) {
    toast({
      title: "Missing information",
      description: "Please enter email and password",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  // DUMMY LOGIN - Backend disabled temporarily
  /**
  try {
    toast({
      title: "Welcome back!",
      description: "Successfully logged in.",
    });
    
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];
    
    setuserId(Math.floor(Math.random() * 10000)); // Dummy user ID
    setLoginEmail(email);
    setLoginDate(date);
    setLoginTime(time);

    onLogin(
      "Demo User",
      "DA",
      "DA100"
    );
  } catch (error: any) {
    console.error("Error during login:", error);
  }
 */
  /* BACKEND CALL - Commented out temporarily*/
  try {

    const userDate=new Date().toLocaleDateString("en-CA");
    const userTime = new Date().toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });


    console.log("User date:", userDate);
    console.log("User time:", userTime);

    const payload = {
      email: email,
      password: password,
      userDate: userDate,
      userTime: userTime
    };

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Invalid email or password");
      } else if (res.status === 404) {
        throw new Error("Account not found. Please sign up first.");
      }
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json(); console.log(data);

    if (data.status === "success" && data.user) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      
      
      
      setuserId(data.user.user_id);
      setLoginEmail(email);
      setLoginDate(userDate);
      setLoginTime(userTime);
      setUserLogId(data.user_log_id)
      
      onLogin(
        data.user.name || "User",
        data.user.track || "DA",
        data.user.batch_code || "DA100"
      );
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    
    let errorMessage = "Login failed";
    let errorDescription = error.message;
    
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      errorMessage = "Connection timeout";
      errorDescription = "The backend server is taking too long to respond";
    } else if (error.message?.includes('Failed to fetch')) {
      errorMessage = "Backend not accessible";
      errorDescription = "Cannot reach the backend server. Please check if the backend URL is correct and the service is running.";
    }
    
    toast({
      title: errorMessage,
      description: errorDescription,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-10 w-10 object-contain" />
            <h1 className="text-base md:text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side - Tagline */}
        <div className="flex-1 max-w-2xl animate-fade-in text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Master the technologies that power{" "}
            <span className="text-primary">healthcare analysis</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
            Excellence in healthcare analytics requires mastery of SQL, Python, and Statistics.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Begin your journey to expertise with us today.
          </p>
        </div>

        {/* Right Side - Login/Sign Up Form */}
        <Card className="w-full max-w-md shadow-lg animate-scale-in bg-card border-border hover:shadow-xl transition-all duration-300">
          <CardHeader className="text-center space-y-3 pb-6 pt-8 px-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Get Started
            </CardTitle>
            <p className="text-sm text-muted-foreground">Login or create your account</p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-5 mt-6 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={!email || !password || isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground transition-all hover:scale-[1.02] shadow-card hover:shadow-elegant font-semibold text-base mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <img src={ninjaSpinner} alt="Loading" className="w-6 h-6 animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-5 mt-6 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="track" className="text-sm font-medium">Track</Label>
                  <Select value={track} onValueChange={setTrack}>
                    <SelectTrigger id="track" className="h-12 transition-all focus:ring-2 focus:ring-primary border-border">
                      <SelectValue placeholder="Select your track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DA">DA - Data Analyst</SelectItem>
                      <SelectItem value="SDET">SDET - Software Development Engineer in Test</SelectItem>
                      <SelectItem value="DVLPR">DVLPR - Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchCode" className="text-sm font-medium">Batch Code</Label>
                  <Input
                    id="batchCode"
                    type="text"
                    placeholder="e.g., DA100"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 transition-all focus:ring-2 focus:ring-primary border-border"
                  />
                </div>

                <Button
                  onClick={handleSignUp}
                  disabled={!name || !track || !batchCode || !email || !password || isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground transition-all hover:scale-[1.02] shadow-card hover:shadow-elegant font-semibold text-base mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <img src={ninjaSpinner} alt="Loading" className="w-6 h-6 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-sm text-primary hover:underline font-semibold">
                    Learn More ❯
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About Healthcare Analysis HQ</DialogTitle>
                  <DialogDescription className="pt-4 space-y-4">
                      <p className="mb-4">
                        Healthcare Analysis HQ (HAQ) is your daily companion for mastering
                        healthcare analysis technologies.
                      </p>
                      <p className="mb-4">
                        Complete 15 daily queries to earn your certificate and demonstrate your
                        expertise in healthcare data analysis.
                      </p>
                      <p className="text-primary font-semibold">
                        Start your journey today!
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

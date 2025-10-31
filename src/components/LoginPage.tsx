import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ninjaLogo from "@/assets/ninja-logo.png";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/config";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: (name: string, track: string, batchCode: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [track, setTrack] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showTechDialog, setShowTechDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const { setuserId, setLoginEmail, setLoginDate, setLoginTime } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // DUMMY LOGIN - Backend disabled temporarily
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

  /* BACKEND CALL - Commented out temporarily
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      name: name,
      track: track,
      batch_code: batchCode,
      email: email,
      password: password,
      zone: timezone
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
        description: "You can now proceed with your learning journey.",
      });

      onLogin(name, track, batchCode);
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
  }
  */
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

  // DUMMY LOGIN - Backend disabled temporarily
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

  /* BACKEND CALL - Commented out temporarily
  try {
    const payload = {
      email: email,
      password: password
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

    const data = await res.json();

    if (data.status === "success" && data.user) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];
      
      setuserId(data.user.user_id);
      setLoginEmail(email);
      setLoginDate(date);
      setLoginTime(time);

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
  }
  */
};

  const handleLogout_supabase = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  const handleLogout = async () => {
  // DUMMY LOGOUT - Backend disabled temporarily
  setIsLoggedIn(false);
  setCurrentUser(null);
  setLoginEmail(null);
  setLoginDate(null);
  setLoginTime(null);
  
  toast({
    title: "Logged out",
    description: "You have been successfully logged out.",
  });

  /* BACKEND CALL - Commented out temporarily
  try {
    const res = await fetch("https://your-ngrok-url.ngrok-free.app/webhook-test/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email })
    });

    const data = await res.json();

    if (data.status === "success") {
      setIsLoggedIn(false);
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: data.message,
      });
      setLoginEmail(null);
      setLoginDate(null);
      setLoginTime(null);
    } else {
      toast({
        title: "Logout failed",
        description: data.message || "Unknown error",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Network error",
      description: "Failed to reach logout service",
      variant: "destructive",
    });
  }
  */
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
          <nav className="flex gap-4 md:gap-8 items-center">
            <button 
              onClick={() => navigate("/technology")}
              className="nav-link text-sm md:text-base"
            >
              Technology
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="nav-link text-sm md:text-base hidden sm:block"
            >
              About Us
            </button>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                Logout
              </Button>
            ) : (
              <button 
                onClick={() => setActiveTab("login")}
                className="nav-link !text-primary text-sm md:text-base"
              >
                Login
              </button>
            )}
          </nav>
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
                  disabled={!email || !password}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground transition-all hover:scale-[1.02] shadow-card hover:shadow-elegant font-semibold text-base mt-2"
                >
                  Login
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
                  disabled={!name || !track || !batchCode || !email || !password}
                  className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground transition-all hover:scale-[1.02] shadow-card hover:shadow-elegant font-semibold text-base mt-2"
                >
                  Create Account
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

      {/* Technology Selection Dialog */}
      <Dialog open={showTechDialog} onOpenChange={setShowTechDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Technology</DialogTitle>
            <DialogDescription>
              Select the technology you want to focus on for your learning journey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => {
                toast({
                  title: "Python Selected",
                  description: "You've chosen to learn Python for healthcare analysis.",
                });
                setShowTechDialog(false);
              }}
            >
              <span className="text-2xl">🐍</span>
              <span className="font-semibold">Python</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => {
                toast({
                  title: "SQL Selected",
                  description: "You've chosen to learn SQL for healthcare analysis.",
                });
                setShowTechDialog(false);
              }}
            >
              <span className="text-2xl">🗄️</span>
              <span className="font-semibold">SQL</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

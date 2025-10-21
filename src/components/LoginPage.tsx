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
import haqLogo from "@/assets/haq-logo.png";


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
  const { toast } = useToast();

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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            track,
            batch_code: batchCode,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "You can now proceed with your learning journey.",
      });

      // Auto-login after signup
      onLogin(name, track, batchCode);
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
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

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });

      // Get user metadata for name, track, batchCode
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        onLogin(
          user.user_metadata.name || "User",
          user.user_metadata.track || "DA",
          user.user_metadata.batch_code || "DA100"
        );
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={haqLogo} alt="HAQ" className="h-10" />
            <h1 className="text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ (HAQ)</h1>
          </div>
          <nav className="flex gap-8 items-center">
            {isLoggedIn ? (
              <button 
                onClick={() => setShowTechDialog(true)}
                className="nav-link"
              >
                Technology
              </button>
            ) : (
              <span className="text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                Technology
              </span>
            )}
            <button className="nav-link">
              About Us
            </button>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-sm font-medium"
              >
                Logout
              </Button>
            ) : (
              <button className="nav-link !text-primary">
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-16 flex items-center justify-between gap-16">
        {/* Left Side - Tagline */}
        <div className="flex-1 max-w-xl animate-fade-in">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Ready to master the technologies that power healthcare analysis?
          </h2>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            Being a healthcare analyst comes down to mastering SQL, Python and Statistics.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Start your journey to mastery with us today.
          </p>
        </div>

        {/* Right Side - Login/Sign Up Form */}
        <Card className="w-full max-w-md shadow-2xl animate-scale-in bg-card border-border backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">
              Get Started
            </CardTitle>
            <p className="text-sm text-muted-foreground">Login or create your account</p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-5 mt-6">
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
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg font-semibold text-base mt-2"
                >
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-5 mt-6">
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
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg font-semibold text-base mt-2"
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
                    <DialogDescription className="space-y-4 pt-4">
                      <p>
                        Healthcare Analysis HQ (HAQ) is your daily companion for mastering
                        healthcare analysis technologies.
                      </p>
                      <p>
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

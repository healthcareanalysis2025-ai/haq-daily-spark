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
import haqLogo from "@/assets/haq-logo.png";


interface LoginPageProps {
  onLogin: (name: string, track: string, batchCode: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [track, setTrack] = useState("");
  const [batchCode, setBatchCode] = useState("");

  const handleSubmit = () => {
    if (name && track && batchCode) {
      onLogin(name, track, batchCode);
    }
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
          <nav className="flex gap-8">
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Technology
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About Us
            </button>
            <button className="text-sm font-medium text-primary transition-colors">
              Login
            </button>
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

        {/* Right Side - Sign Up Form */}
        <Card className="w-full max-w-md shadow-2xl animate-scale-in bg-card border-border backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">
              Get Started
            </CardTitle>
            <p className="text-sm text-muted-foreground">Create your account to begin learning</p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">

            <div className="space-y-5">
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

              <Button
                onClick={handleSubmit}
                disabled={!name || !track || !batchCode}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg font-semibold text-base mt-2"
              >
                Start Learning
              </Button>
            </div>

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
    </div>
  );
};

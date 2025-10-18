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
import haqLogo from "@/assets/haq-logo.png";

interface LoginPageProps {
  onLogin: (name: string, track: string, batchCode: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [name, setName] = useState("");
  const [track, setTrack] = useState("");
  const [batchCode, setBatchCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && track && batchCode) {
      onLogin(name, track, batchCode);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img
            src={haqLogo}
            alt="HAQ Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary mb-2">
            Healthcare Analysis HAQ
          </h1>
          <p className="text-muted-foreground">
            Ready to master the technologies that power healthcare analysis?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="track">Track</Label>
            <Select value={track} onValueChange={setTrack} required>
              <SelectTrigger id="track" className="rounded-lg">
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
            <Label htmlFor="batchCode">Batch Code</Label>
            <Input
              id="batchCode"
              type="text"
              placeholder="e.g., DA100"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg text-lg py-6 transition-all hover:scale-105"
          >
            Sign Up with Email
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="w-full">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About HAQ</DialogTitle>
                <DialogDescription className="space-y-2 pt-4">
                  <p>
                    Healthcare Analysis HAQ is a 15-day learning journey designed to help you master
                    essential healthcare analysis technologies.
                  </p>
                  <p>
                    Complete one query each day to build your skills progressively. Upon completing
                    all 15 queries, you'll receive a certificate of completion.
                  </p>
                  <p className="text-primary font-semibold">
                    Start your learning journey today!
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </form>
      </div>
    </div>
  );
};

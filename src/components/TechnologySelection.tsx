import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Code2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ninjaLogo from "@/assets/ninja-logo.png";

interface TechnologySelectionProps {
  onSelect: (technology: "sql" | "python") => void;
}

export const TechnologySelection = ({ onSelect }: TechnologySelectionProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-8 md:h-10" />
            <h1 className="text-sm md:text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ (HAQ)</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-16 animate-fade-in text-center">
          What would you like to learn today?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full animate-scale-in">
          {/* SQL Card */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            onClick={() => onSelect("sql")}
          >
            <CardContent className="p-6 md:p-12 flex flex-col items-center text-center">
              <div className="mb-4 md:mb-6 p-6 md:p-8 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Database className="w-16 md:w-20 h-16 md:h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">SQL</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold">Requirements</p>
                <p>-Postgres server and PG Admin Installed</p>
                <p>-Able to restore DB (provided by us)</p>
                <p>-10 minutes a day</p>
              </div>
            </CardContent>
          </Card>

          {/* Python Card */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border opacity-50 pointer-events-none"
          >
            <CardContent className="p-6 md:p-12 flex flex-col items-center text-center">
              <div className="mb-4 md:mb-6 p-6 md:p-8 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-16 md:w-20 h-16 md:h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">PYTHON</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold">Requirements</p>
                <p>-Anaconda or Jupyter Notebook Installed</p>
                <p>-10 minutes a day</p>
              </div>
              <p className="text-xs text-primary mt-4 font-semibold">Coming Soon</p>
            </CardContent>
          </Card>
        </div>

        <button className="mt-8 md:mt-16 text-sm text-primary font-semibold hover:underline animate-fade-in">
          Learn More ❯
        </button>
      </main>
    </div>
  );
};

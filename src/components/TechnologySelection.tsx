import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Code2, LogOut } from "lucide-react";
import { toast } from "sonner";
import ninjaLogo from "@/assets/ninja-logo.png";

interface TechnologySelectionProps {
  onSelect: (technology: "sql" | "python") => void;
}

export const TechnologySelection = ({ onSelect }: TechnologySelectionProps) => {
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-8 md:h-10 object-contain" />
            <h1 className="text-sm md:text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-16 flex flex-col items-center justify-center">
        <div className="text-center mb-12 md:mb-16 space-y-3 animate-fade-in">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            What would you like to learn today?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose a technology to begin your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full animate-scale-in">
          {/* SQL Card */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden"
            onClick={() => onSelect("sql")}
          >
            <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="mb-6 md:mb-8 p-8 md:p-10 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-all duration-300 shadow-sm">
                <Database className="w-16 md:w-20 h-16 md:h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground tracking-tight">SQL</h3>
              <div className="text-xs md:text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                <p className="font-semibold text-foreground">Requirements</p>
                <p>• Postgres server and PG Admin installed</p>
                <p>• Able to restore DB (provided by us)</p>
                <p>• 10 minutes a day commitment</p>
              </div>
              <div className="mt-6 text-xs md:text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Get Started →
              </div>
            </CardContent>
          </Card>

          {/* Python Card */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden"
            onClick={() => onSelect("python")}
          >
            <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="mb-6 md:mb-8 p-8 md:p-10 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-all duration-300 shadow-sm">
                <Code2 className="w-16 md:w-20 h-16 md:h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground tracking-tight">PYTHON</h3>
              <div className="text-xs md:text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                <p className="font-semibold text-foreground">Requirements</p>
                <p>• Anaconda or Jupyter Notebook installed</p>
                <p>• 10 minutes a day commitment</p>
              </div>
              <div className="mt-6 text-xs md:text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Get Started →
              </div>
            </CardContent>
          </Card>
        </div>

        <button className="mt-8 md:mt-16 text-xs md:text-sm text-primary font-semibold hover:underline hover:translate-x-1 transition-all animate-fade-in">
          Learn More →
        </button>
      </main>
    </div>
  );
};

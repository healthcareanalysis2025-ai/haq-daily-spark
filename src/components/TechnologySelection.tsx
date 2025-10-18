import { Card, CardContent } from "@/components/ui/card";
import { Database, Code2 } from "lucide-react";

interface TechnologySelectionProps {
  onSelect: (technology: "sql" | "python") => void;
}

export const TechnologySelection = ({ onSelect }: TechnologySelectionProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/src/assets/haq-logo.png" alt="HAQ" className="h-10" />
            <h1 className="text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ (HAQ)</h1>
          </div>
          <nav className="flex gap-8">
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Technology
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About Us
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-foreground mb-16 animate-fade-in">
          What would you like to learn today?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full animate-scale-in">
          {/* SQL Card */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            onClick={() => onSelect("sql")}
          >
            <CardContent className="p-12 flex flex-col items-center text-center">
              <div className="mb-6 p-8 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Database className="w-20 h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">SQL</h3>
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
            <CardContent className="p-12 flex flex-col items-center text-center">
              <div className="mb-6 p-8 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-20 h-20 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">PYTHON</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold">Requirements</p>
                <p>-Anaconda or Jupyter Notebook Installed</p>
                <p>-10 minutes a day</p>
              </div>
              <p className="text-xs text-primary mt-4 font-semibold">Coming Soon</p>
            </CardContent>
          </Card>
        </div>

        <button className="mt-16 text-sm text-primary font-semibold hover:underline animate-fade-in">
          Learn More ❯
        </button>
      </main>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, X, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";

interface CompletionPageProps {
  day: string;
  onBackToDashboard: () => void;
  onBackToTechSelection: () => void;
}

export const CompletionPage = ({ day, onBackToDashboard, onBackToTechSelection }: CompletionPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md p-8 text-center space-y-6 shadow-elegant animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Great Job!</h2>
            <p className="text-muted-foreground">
              You've completed the query for {new Date(day).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Check your progress on the calendar</span>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={onBackToDashboard}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>

          <Button
            onClick={onBackToTechSelection}
            variant="outline"
            className="w-full h-12 font-semibold"
          >
            <X className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Keep up the great work! Come back tomorrow for the next challenge.
        </p>
      </Card>
      </div>
    </div>
  );
};

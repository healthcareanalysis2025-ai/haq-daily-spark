import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, TrendingUp, Calendar, Award, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressStatsProps {
  userName: string;
  completedDays: number[];
  attemptedDays: number[];
  onBack: () => void;
}

export const ProgressStats = ({
  userName,
  completedDays,
  attemptedDays,
  onBack,
}: ProgressStatsProps) => {
  const totalDays = 15;
  const completedCount = completedDays.length;
  const attemptedCount = attemptedDays.length;
  const successRate = attemptedCount > 0 ? (completedCount / attemptedCount) * 100 : 0;
  const overallProgress = (completedCount / totalDays) * 100;
  
  // Calculate streak
  const calculateStreak = () => {
    if (completedDays.length === 0) return 0;
    const sorted = [...completedDays].sort((a, b) => b - a);
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i] - sorted[i + 1] === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  
  // Get achievement badges
  const achievements = [
    { 
      name: "First Step", 
      description: "Complete your first query",
      unlocked: completedCount >= 1,
      icon: "🎯"
    },
    { 
      name: "On Fire", 
      description: "3-day streak",
      unlocked: currentStreak >= 3,
      icon: "🔥"
    },
    { 
      name: "Half Way", 
      description: "Complete 7+ queries",
      unlocked: completedCount >= 7,
      icon: "⭐"
    },
    { 
      name: "Almost There", 
      description: "Complete 10+ queries",
      unlocked: completedCount >= 10,
      icon: "🚀"
    },
    { 
      name: "Perfect Score", 
      description: "100% success rate with 5+ attempts",
      unlocked: successRate === 100 && attemptedCount >= 5,
      icon: "💯"
    },
    { 
      name: "Master", 
      description: "Complete all 15 queries",
      unlocked: completedCount === 15,
      icon: "👑"
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Your Progress, {userName}
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-primary">{completedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attempted</p>
                <p className="text-3xl font-bold text-foreground">{attemptedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-success">{successRate.toFixed(0)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-orange-500">{currentStreak}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Overall Progress</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completion Progress</span>
                <span className="text-sm font-semibold text-primary">
                  {completedCount}/{totalDays} days
                </span>
              </div>
              <Progress value={overallProgress} className="h-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {overallProgress.toFixed(1)}% complete
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-3xl font-bold text-success">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {attemptedCount - completedCount}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground">
                  {totalDays - attemptedCount}
                </div>
                <div className="text-sm text-muted-foreground">Not Started</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.name}
                className={`p-6 transition-all ${
                  achievement.unlocked
                    ? "bg-primary/5 border-primary"
                    : "bg-muted/30 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <Badge variant="default" className="text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Day-by-Day Breakdown */}
        <Card className="p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-6">Day-by-Day Progress</h2>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const isCompleted = completedDays.includes(day);
              const isAttempted = attemptedDays.includes(day);
              
              return (
                <div
                  key={day}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center
                    font-semibold text-lg transition-all
                    ${
                      isCompleted
                        ? "bg-success text-success-foreground shadow-md"
                        : isAttempted
                        ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-500"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  <span className="text-xs opacity-75 mb-1">Day</span>
                  <span>{day}</span>
                  {isCompleted && <span className="text-xs mt-1">✓</span>}
                  {isAttempted && !isCompleted && <span className="text-xs mt-1">⏳</span>}
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-success rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500/20 border-2 border-yellow-500 rounded"></div>
              <span>Attempted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded"></div>
              <span>Not Started</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

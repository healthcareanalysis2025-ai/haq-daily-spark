import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, XCircle, TrendingUp, Calendar, Award, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressStatsProps {
  userName: string;
  completedDays: string[];
  attemptedDays: string[];
  missedDays?: string[];
  totalDays?: number;
  onBack: () => void;
}

export const ProgressStats = ({
  userName,
  completedDays,
  attemptedDays,
  missedDays = [],
  totalDays = 15,
  onBack,
}: ProgressStatsProps) => {
  const completedCount = completedDays.length;
  const attemptedCount = attemptedDays.length;
  const missedCount = missedDays.length;
  const successRate = attemptedCount > 0 ? (completedCount / attemptedCount) * 100 : 0;
  const overallProgress = (completedCount / totalDays) * 100;
  console.log("from dashboard ");
  console.log(completedDays);
  // Calculate streak based on consecutive dates
  const calculateStreak = () => {
    if (completedDays.length === 0) return 0;
    const dates = completedDays
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime()); // Most recent first
    
    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const diffInDays = Math.floor((dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
      if (diffInDays === 1) {
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
      description: "100% score with 5+ attempts",
      unlocked: successRate === 100 && attemptedCount >= 5,
      icon: "💯"
    },
    { 
      name: "Master", 
      description: "Complete minimum 15 queries with 70%+ score",
      unlocked: completedCount >= 15 && successRate >= 70,
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
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Missed</p>
                <p className="text-3xl font-bold text-destructive">{missedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
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
                <div className="text-3xl font-bold text-destructive">{missedCount}</div>
                <div className="text-sm text-muted-foreground">Missed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground">
                  {totalDays - completedCount - missedCount}
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
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          
          <div className="space-y-3">
            {completedDays.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-primary mb-3">Completed Dates:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {completedDays.map((date) => (
                    <div
                      key={date}
                      className="bg-success/10 border-2 border-success text-success-foreground rounded-lg p-3 text-center font-semibold"
                    >
                      <div className="text-xs opacity-75 mb-1">Completed</div>
                      <div>{new Date(date).toLocaleDateString()}</div>
                      <div className="text-xs mt-1">✓</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No completed queries yet. Start by selecting a date on the calendar!
              </p>
            )}
            
            {attemptedDays.length > completedDays.length && (
              <>
                <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3 mt-6">
                  Attempted (Not Completed):
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {attemptedDays
                    .filter(date => !completedDays.includes(date))
                    .map((date) => (
                      <div
                        key={date}
                        className="bg-yellow-500/10 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 rounded-lg p-3 text-center font-semibold"
                      >
                        <div className="text-xs opacity-75 mb-1">Attempted</div>
                        <div>{new Date(date).toLocaleDateString()}</div>
                        <div className="text-xs mt-1">⏳</div>
                      </div>
                    ))}
                </div>
              </>
            )}
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
          </div>
        </Card>
      </div>
    </div>
  );
};

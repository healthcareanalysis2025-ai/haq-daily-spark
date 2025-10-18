import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Confetti } from "./Confetti";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QueryPageProps {
  day: number;
  onBack: () => void;
  onComplete: (day: number) => void;
  hasAttempted: boolean;
}

// Sample questions for 15 days
const questions: Question[] = [
  {
    question: "What is SQL primarily used for?",
    options: ["Data Analysis", "Web Design", "Graphic Design", "Video Editing"],
    correctAnswer: 0,
  },
  {
    question: "Which of these is a relational database management system?",
    options: ["MongoDB", "PostgreSQL", "Redis", "Elasticsearch"],
    correctAnswer: 1,
  },
  {
    question: "What does ETL stand for in data processing?",
    options: [
      "Extract, Transform, Load",
      "Evaluate, Test, Launch",
      "Export, Transfer, Link",
      "Enter, Track, List",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which tool is commonly used for data visualization?",
    options: ["Tableau", "Git", "Docker", "Jenkins"],
    correctAnswer: 0,
  },
  {
    question: "What is the purpose of data normalization?",
    options: [
      "To increase data redundancy",
      "To reduce data redundancy",
      "To delete data",
      "To encrypt data",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which programming language is most popular for data analysis?",
    options: ["Java", "C++", "Python", "Ruby"],
    correctAnswer: 2,
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Program Integration",
      "Automated Process Interaction",
      "Application Process Interface",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which of these is a NoSQL database?",
    options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"],
    correctAnswer: 2,
  },
  {
    question: "What is the purpose of a primary key in a database?",
    options: [
      "To uniquely identify records",
      "To store passwords",
      "To create backups",
      "To encrypt data",
    ],
    correctAnswer: 0,
  },
  {
    question: "What does HIPAA regulate?",
    options: [
      "Healthcare data privacy",
      "Software licensing",
      "Cloud computing",
      "Network security",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which SQL clause is used to filter results?",
    options: ["SELECT", "FROM", "WHERE", "GROUP BY"],
    correctAnswer: 2,
  },
  {
    question: "What is the purpose of data validation?",
    options: [
      "To ensure data accuracy",
      "To delete old data",
      "To compress data",
      "To share data",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which chart type is best for showing trends over time?",
    options: ["Pie chart", "Line chart", "Scatter plot", "Bar chart"],
    correctAnswer: 1,
  },
  {
    question: "What does BI stand for in healthcare analytics?",
    options: [
      "Business Intelligence",
      "Binary Integration",
      "Basic Interface",
      "Backup Information",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which metric measures central tendency?",
    options: ["Standard deviation", "Mean", "Range", "Variance"],
    correctAnswer: 1,
  },
];

export const QueryPage = ({
  day,
  onBack,
  onComplete,
  hasAttempted,
}: QueryPageProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(hasAttempted);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = questions[day - 1];

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer!");
      return;
    }

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      setShowConfetti(true);
      toast.success("Correct! Great job! 🎉");
      setTimeout(() => {
        onComplete(day);
        setShowConfetti(false);
      }, 2000);
    } else {
      toast.error("Incorrect! Try again tomorrow.");
    }
  };

  const handleEmailQuery = () => {
    toast.success("Query and your response have been emailed!");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {showConfetti && <Confetti />}
      
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary">Day {day} Query</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmailQuery}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Query
              </Button>
            </div>
            <p className="text-muted-foreground">
              Answer the question below to complete today's challenge
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">
              {currentQuestion.question}
            </h3>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              disabled={submitted}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center space-x-3 p-4 rounded-lg border-2 transition-all
                    ${
                      submitted
                        ? index === currentQuestion.correctAnswer
                          ? "border-success bg-success/10"
                          : selectedAnswer === index
                          ? "border-destructive bg-destructive/10"
                          : "border-border"
                        : "border-border hover:border-accent"
                    }
                  `}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {String.fromCharCode(97 + index)}) {option}
                  </Label>
                  {submitted && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {submitted &&
                    selectedAnswer === index &&
                    index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {!submitted ? (
            <Button
              onClick={handleSubmit}
              className="w-full py-6 text-lg transition-all hover:scale-105"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="text-center">
              {isCorrect ? (
                <div className="space-y-4">
                  <div className="text-success font-semibold text-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Correct! Well done!
                  </div>
                  <p className="text-muted-foreground">
                    Returning to dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-destructive font-semibold text-xl flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6" />
                    Incorrect! Try again tomorrow.
                  </div>
                  <p className="text-muted-foreground">
                    The correct answer is highlighted above.
                  </p>
                  <Button onClick={onBack} className="mt-4">
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

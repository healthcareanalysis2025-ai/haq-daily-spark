import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, CheckCircle, XCircle, Download, Settings, ExternalLink, Database, Server, FolderPlus, FileText, Upload, PlayCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Confetti } from "./Confetti";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/config";

interface Question {
  mcq_id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  correctOption: string;
}

interface QueryPageProps {
  day: string;
  onBack: () => void;
  onComplete: (day: string) => void;
  hasAttempted: boolean;
}

// Sample questions for 15 days


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
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // const currentQuestion = questions[day - 1];

  //const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [answers, setAnswers] = useState<(number | null)[]>([]); // will initialize after fetch
const [questions, setQuestions] = useState<Question[]>([]);
 const [loading, setLoading] = useState(true);
const { userId,loginEmail,loginDate,loginTime } = useUser();
  const [mainQuery, setMainQuery] = useState<string>("");
  const [loadingMainQuery, setLoadingMainQuery] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string>("");

 useEffect(() => {
    const fetchQuestions = async () => {
      try {
        
        console.log("Date ",loginDate," user ",userId);
        
        //const res = await fetch("https://mite-kind-neatly.ngrok-free.app/webhook-test/getQuestions", {
    const res = await fetch(`${BASE_URL}/getQuestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({current_date:loginDate}), //  send key-value data
    });
        if (!res.ok) throw new Error("Failed to fetch questions");
        
        const rawData = await res.json(); // raw n8n items
        console.log(rawData);
        console.log("array kength ",rawData.length);
        
// check if rawData is array or wrapped in {mcqs: [...]}
const data: Question[] = Array.isArray(rawData)
  ? rawData
  : Array.isArray(rawData.mcqs)
  ? rawData.mcqs
  : [];
        console.log("Fetched questions:", data);

        setQuestions(data);
        setAnswers(Array(data.length).fill(null)); // initialize answers array
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Error fetching questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }
  
  const currentQuestion = questions;
const handleSelect = (qIndex: number, value: number) => {
  setAnswers(prev => {
    const newAnswers = [...prev];
    newAnswers[qIndex] = value;
    return newAnswers;
  });
};

const handleSubmit = async () => {
  // 1️⃣ Check if any question is unanswered
  if (answers.some((ans) => ans === null)) {
    toast.error("Please answer all questions!");
    return;
  }

  // 2️⃣ Check correctness for each question
  const results = questions.map((q, i) => answers[i] === q.correctAnswer);

  // 3️⃣ Count correct answers
  const correctCount = results.filter(Boolean).length;

  // 4️⃣ Prepare payload for n8n
  const payload = {
    responses: questions.map((q, i) => ({
      mcq_id: q.mcq_id,
      user_id: userId,
      selected_option: String.fromCharCode(65 + answers[i]!),
      correct_flag: results[i],
      answered: true,
      respond_date: loginDate,
    })),
    summary: {
      no_correct: correctCount,
      total_mcq: questions.length,
      user_id: userId,
      respond_date: loginDate,
      question_id: 1,
    },
  };

  console.log("Payload sent to n8n:", payload);

  try {
    const res = await fetch(`${BASE_URL}/submitResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`n8n API error: ${errorText || res.statusText}`);
    }

    const data = await res.json();
    console.log("n8n raw response:", data);

    // 🧩 Normalize array/object
    const result = Array.isArray(data) ? data[0] : data;

    // ✅ Now result.status and result.message will always exist
    if (result.status === "fail") {
      toast.error(result.message || "Already responded for the day!!");
      setSubmitted(false);
      return;
    }

    if (result.status === "success") {
      toast.success(result.message || "Responses submitted successfully!");
      if (correctCount === questions.length) {
        setIsCorrect(true);
        setShowConfetti(true);
        toast.success("All answers correct! 🎉 Great job!");
        setTimeout(() => {
          onComplete(day);
          setShowConfetti(false);
        }, 2000);
      } else {
        setIsCorrect(false);
        toast.error(`You got ${correctCount}/${questions.length} correct.`);
      }
      setSubmitted(true);
    } else {
      toast.error("Unexpected response from server.");
      console.warn("Unexpected n8n response:", data);
      setSubmitted(false);
    }

  } catch (err) {
    console.error("Submission failed:", err);
    toast.error(`Failed to submit responses: ${err.message || err}`);
    setSubmitted(false);
  }
};




  const handleEmailQuery = () => {
    toast.success("Query and solution have been emailed");
  };

  const fetchMainQuery = async () => {
    if (!sheetUrl.trim()) {
      toast.error("Please enter a Google Sheet URL");
      return;
    }

    setLoadingMainQuery(true);
    try {
      // Extract sheet ID from URL
      const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        toast.error("Invalid Google Sheet URL");
        setLoadingMainQuery(false);
        return;
      }

      const sheetId = sheetIdMatch[1];
      // Fetch from Google Sheets API (published as CSV)
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from Google Sheet");
      }

      const csvText = await response.text();
      // Parse CSV - assuming query is in first row, first column
      const lines = csvText.split('\n');
      if (lines.length > 0) {
        const query = lines[0].split(',')[0].replace(/"/g, '');
        setMainQuery(query);
        toast.success("Main query fetched successfully!");
      } else {
        toast.error("No data found in sheet");
      }
    } catch (error) {
      console.error("Error fetching main query:", error);
      toast.error("Failed to fetch main query from Google Sheet");
    } finally {
      setLoadingMainQuery(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Questions (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8 shadow-md border-border hover:shadow-lg transition-all duration-300">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      Query for {new Date(day).toLocaleDateString()}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Answer all questions below to complete today's challenge
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailQuery}
                    className="gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email Query</span>
                  </Button>
                </div>
              </div>

              <div className="mb-10 space-y-8">
                {currentQuestion.map((q, qIndex) => (
                  <div key={q.mcq_id} className="p-6 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="text-lg md:text-xl font-bold mb-6 text-foreground tracking-tight">
                      {qIndex + 1}. {q.question}
                    </h3>

                    <RadioGroup
                      value={answers[qIndex]?.toString()}
                      onValueChange={(value) => handleSelect(qIndex, parseInt(value))}
                      disabled={submitted}
                      className="space-y-3"
                    >
                      {q.options.map((option, index) => (
                        <div
                          key={index}
                          className={`
                            flex items-center space-x-3 p-4 md:p-5 rounded-md border transition-all duration-200
                            ${
                              submitted
                                ? index === q.correctAnswer
                                  ? "border-success bg-success/10 shadow-sm"
                                  : answers[qIndex] === index && index !== q.correctAnswer
                                  ? "border-destructive bg-destructive/10 shadow-sm"
                                  : "border-border bg-card"
                                : "border-border bg-card hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                            }
                          `}
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${qIndex}-${index}`} />
                          <Label
                            htmlFor={`option-${qIndex}-${index}`}
                            className="flex-1 cursor-pointer font-medium text-sm md:text-base"
                          >
                            {String.fromCharCode(97 + index)}) {option}
                          </Label>

                          {submitted && index === q.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                          )}
                          {submitted &&
                            answers[qIndex] === index &&
                            index !== q.correctAnswer && (
                              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                            )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              {/* Main Query from Google Sheet */}
              <div className="mb-10 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Fetch Main Query from Google Sheet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the Google Sheet URL below to fetch the main SQL query for today's challenge.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Paste Google Sheet URL here..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={fetchMainQuery}
                    disabled={loadingMainQuery || !sheetUrl.trim()}
                    className="gap-2 whitespace-nowrap"
                  >
                    {loadingMainQuery ? "Fetching..." : "Fetch Query"}
                  </Button>
                </div>

                {mainQuery && (
                  <div className="mt-6 p-4 bg-card rounded-lg border border-border">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Main Query:</h4>
                    <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-mono bg-muted/50 p-4 rounded">
                      {mainQuery}
                    </pre>
                  </div>
                )}
              </div>

              {!submitted ? (
                <Button
                  onClick={handleSubmit}
                  className="w-full py-6 text-base md:text-lg font-semibold shadow-card hover:shadow-card-hover transition-all hover:scale-[1.02]"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="text-center p-6 bg-muted/20 rounded-xl">
                  {isCorrect ? (
                    <div className="space-y-4">
                      <div className="text-success font-bold text-xl md:text-2xl flex items-center justify-center gap-3">
                        <CheckCircle className="w-8 h-8" />
                        Correct! Well done!
                      </div>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Returning to dashboard...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-destructive font-bold text-xl md:text-2xl flex items-center justify-center gap-3">
                        <XCircle className="w-8 h-8" />
                        Incorrect! Try again tomorrow.
                      </div>
                      <p className="text-muted-foreground text-sm md:text-base mb-4">
                        The correct answers are highlighted above.
                      </p>
                      <Button onClick={onBack} className="mt-4 shadow-card hover:shadow-card-hover">
                        Return to Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Clinical Dataset (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50 hover:shadow-lg transition-all duration-300 sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Clinical Dataset</CardTitle>
                    <CardDescription className="mt-1.5 text-xs">
                      Access the complete medical database for advanced analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md"
                  size="lg"
                  asChild
                >
                  <a href="https://drive.google.com/your-dataset-link" target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                    Download Dataset
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 hover:bg-primary/5 hover:border-primary/50"
                  size="lg"
                  onClick={() => setShowSetupGuide(true)}
                >
                  <Settings className="w-4 h-4" />
                  Setup Guide
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 hover:bg-primary/5 hover:border-primary/50"
                  size="lg"
                  asChild
                >
                  <a href="https://physionet.org" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    PhysioNet Details
                  </a>
                </Button>
                <div className="pt-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    Data sourced from{" "}
                    <a 
                      href="https://physionet.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      PhysioNet
                    </a>
                    {" "}- A repository of freely-available medical research data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Setup Guide Dialog */}
      <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-card to-muted/20 border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">pgAdmin Database Setup Guide</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {/* Step 1 */}
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Connect to Server</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Open pgAdmin and connect to your PostgreSQL server.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FolderPlus className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Create Database</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Right-click on "Databases" → "Create" → "Database..."
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Name Database</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Name the database <code className="px-2 py-0.5 bg-muted rounded text-primary font-mono text-xs">medical_queries</code> and click "Save".
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Start Restore</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Right-click the new database → "Restore..."
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  5
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Complete Restore</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select the downloaded SQL file and click "Restore" to import the dataset.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

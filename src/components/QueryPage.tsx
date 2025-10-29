import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle, XCircle } from "lucide-react";
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
  day: number;
  onBack: () => void;
  onComplete: (day: number) => void;
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

  // const currentQuestion = questions[day - 1];

  //const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [answers, setAnswers] = useState<(number | null)[]>([]); // will initialize after fetch
const [questions, setQuestions] = useState<Question[]>([]);
 const [loading, setLoading] = useState(true);
const { userId,loginEmail,loginDate,loginTime } = useUser();

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
  {currentQuestion.map((q, qIndex) => (
    <div key={q.mcq_id} className="mb-10">
      <h3 className="text-xl font-semibold mb-4">
        {qIndex + 1}. {q.question}
      </h3>

      <RadioGroup
        value={answers[qIndex]?.toString()}
        onValueChange={(value) => handleSelect(qIndex, parseInt(value))}
        disabled={submitted}
        className="space-y-4"
      >
        {q.options.map((option, index) => (
          <div
            key={index}
            className={`
              flex items-center space-x-3 p-4 rounded-lg border-2 transition-all
              ${
                submitted
                  ? index === q.correctAnswer
                    ? "border-success bg-success/10"
                    : answers[qIndex] === index && index !== q.correctAnswer
                    ? "border-destructive bg-destructive/10"
                    : "border-border"
                  : "border-border hover:border-accent"
              }
            `}
          >
            <RadioGroupItem value={index.toString()} id={`option-${qIndex}-${index}`} />
            <Label
              htmlFor={`option-${qIndex}-${index}`}
              className="flex-1 cursor-pointer font-medium"
            >
              {String.fromCharCode(97 + index)}) {option}
            </Label>

            {/* ✅ show icons */}
            {submitted && index === q.correctAnswer && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            {submitted &&
              answers[qIndex] === index &&
              index !== q.correctAnswer && (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
          </div>
        ))}
      </RadioGroup>
    </div>
  ))}
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

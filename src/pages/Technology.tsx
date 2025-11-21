import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Code2, BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ninjaLogo from "@/assets/ninja-logo.png";

export default function Technology() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ninjaLogo} alt="HAQ" className="h-10 w-10 object-contain" />
            <h1 className="text-base md:text-xl font-bold text-foreground">HEALTHCARE ANALYSIS HQ</h1>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Technology Stack for{" "}
              <span className="text-primary">Healthcare Analytics</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master the essential tools and technologies that power modern healthcare data analysis
            </p>
          </div>

          {/* Technology Cards */}
          <div className="grid gap-8 md:gap-10 mt-12">
            {/* SQL Card */}
            <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer" onClick={() => navigate("/")}>
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="p-6 rounded-lg bg-primary/10 flex-shrink-0">
                    <Database className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">SQL</h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Structured Query Language is the foundation of healthcare data analysis. Query patient records, 
                      analyze treatment outcomes, and extract meaningful insights from electronic health records (EHR).
                    </p>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-lg font-semibold text-foreground">What you'll learn:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Complex queries for patient data analysis and reporting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Database design principles for healthcare systems</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Performance optimization for large medical datasets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Data aggregation and statistical analysis using SQL</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Prerequisites:</p>
                      <p className="text-sm text-muted-foreground">
                        • PostgreSQL server and pgAdmin installed<br />
                        • Ability to restore databases (sample data provided)<br />
                        • 10-15 minutes daily practice commitment
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Python Card */}
            <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer" onClick={() => navigate("/")}>
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="p-6 rounded-lg bg-primary/10 flex-shrink-0">
                    <Code2 className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Python</h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Python brings advanced analytics, machine learning, and automation to healthcare data science. 
                      Build predictive models, automate reporting, and create sophisticated visualizations.
                    </p>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-lg font-semibold text-foreground">What you'll learn:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Data manipulation with Pandas for healthcare datasets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Statistical analysis and hypothesis testing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Data visualization using Matplotlib and Seaborn</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Introduction to machine learning for predictive analytics</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Prerequisites:</p>
                      <p className="text-sm text-muted-foreground">
                        • Anaconda or Jupyter Notebook installed<br />
                        • Basic programming concepts understanding<br />
                        • 10-15 minutes daily practice commitment
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="p-6 rounded-lg bg-primary/10 flex-shrink-0">
                    <BarChart3 className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Statistics</h2>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Statistical analysis forms the backbone of evidence-based healthcare decisions. Learn to 
                      interpret clinical trials, analyze treatment efficacy, and make data-driven recommendations.
                    </p>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-lg font-semibold text-foreground">What you'll learn:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Descriptive statistics for healthcare data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Hypothesis testing and confidence intervals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Correlation and regression analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>Clinical trial design and interpretation</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Prerequisites:</p>
                      <p className="text-sm text-muted-foreground">
                        • Basic understanding of mathematics<br />
                        • Excel or statistical software familiarity<br />
                        • 10-15 minutes daily practice commitment
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

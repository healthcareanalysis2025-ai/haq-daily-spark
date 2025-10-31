import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, Heart, ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ninjaLogo from "@/assets/ninja-logo.png";

export default function AboutUs() {
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
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              About <span className="text-primary">Healthcare Analysis HQ</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering healthcare professionals with the analytical skills needed to transform 
              data into actionable insights and improve patient outcomes.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 w-fit">
                  <Target className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize healthcare analytics education by providing accessible, 
                  practical, and industry-relevant training that bridges the gap between 
                  healthcare knowledge and data science expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 w-fit">
                  <Heart className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading platform for healthcare analytics education, 
                  creating a community of skilled analysts who drive innovation and 
                  excellence in healthcare delivery worldwide.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Offer */}
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                What We Offer
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A comprehensive learning experience designed for healthcare professionals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <Card className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="p-4 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Award className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Structured Learning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    15-day progressive curriculum with daily challenges designed to build 
                    mastery through consistent practice and real-world scenarios.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="p-4 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Users className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Healthcare Focus</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All examples, datasets, and exercises are specifically tailored to 
                    healthcare scenarios including EHR systems, patient analytics, and clinical data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="p-4 rounded-lg bg-primary/10 w-fit mx-auto">
                    <Target className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Practical Skills</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Learn by doing with hands-on queries and analysis tasks that mirror 
                    real-world healthcare analytics challenges you'll face in your career.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Who We Serve */}
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                Who We Serve
              </h2>
            </div>

            <Card className="border-border">
              <CardContent className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary">Healthcare Professionals</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Clinical data analysts looking to enhance their technical skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Healthcare administrators seeking data-driven decision making</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Medical professionals transitioning to healthcare analytics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary">Data Professionals</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Data analysts entering the healthcare industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Business intelligence professionals in healthcare organizations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>Students pursuing careers in healthcare informatics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Tracks */}
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                Learning Tracks
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the path that matches your career goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20 border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="px-3 py-1 bg-primary text-primary-foreground w-fit rounded-full text-sm font-bold">
                    DA Track
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Data Analyst</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Focus on SQL, reporting, and data visualization for healthcare insights and business intelligence.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="px-3 py-1 bg-muted text-foreground w-fit rounded-full text-sm font-bold">
                    SDET Track
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Software Development Engineer in Test</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Specialized track for quality assurance in healthcare software systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="px-3 py-1 bg-muted text-foreground w-fit rounded-full text-sm font-bold">
                    DVLPR Track
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Developer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Advanced programming and system architecture for healthcare applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center pt-12 space-y-6 bg-muted/30 p-10 rounded-lg border border-border animate-fade-in">
            <Mail className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Have Questions?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're here to help you succeed in your healthcare analytics journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="gap-2 shadow-md hover:shadow-lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Award, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Confetti } from "./Confetti";
import haqLogo from "@/assets/haq-logo.png";
import { useRef } from "react";

interface CertificatePageProps {
  userName: string;
  track: string;
  batchCode: string;
  onReset: () => void;
}

export const CertificatePage = ({
  userName,
  track,
  batchCode,
  onReset,
}: CertificatePageProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    toast.success("Certificate ready for download!");
    toast.info("Right-click on the certificate and select 'Save image as...' to download");
  };

  const handleShare = () => {
    const text = `🎉 I just completed the 15-Day Healthcare Analysis Query Challenge at HAQ! #HAQ #HealthcareAnalytics #Learning`;
    
    if (navigator.share) {
      navigator.share({
        title: 'HAQ Certificate',
        text: text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success("Share text copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Share text copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Confetti />
      
      <div className="max-w-4xl w-full animate-scale-in">
        <div className="text-center mb-8">
          <Award className="w-20 h-20 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            You've completed all 15 HAQ queries!
          </p>
        </div>

        <Card ref={certificateRef} className="p-8 md:p-12 shadow-2xl border-4 border-primary bg-card">
          <div className="text-center space-y-6">
            <img
              src={haqLogo}
              alt="HAQ Logo"
              className="w-24 h-24 mx-auto"
            />
            
            <div className="border-t-2 border-b-2 border-accent py-6 my-6">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Certificate of Completion
              </h2>
              <p className="text-lg text-muted-foreground">
                Healthcare Analysis HAQ Program
              </p>
            </div>

            <div className="space-y-4 text-lg">
              <p>This certifies that</p>
              <p className="text-3xl font-bold text-primary">{userName}</p>
              <p>has successfully completed the</p>
              <p className="text-xl font-semibold">
                15-Day Healthcare Analysis Query Challenge
              </p>
              <div className="flex justify-center gap-8 mt-6 text-muted-foreground">
                <div>
                  <p className="text-sm">Track</p>
                  <p className="font-semibold text-foreground">{track}</p>
                </div>
                <div>
                  <p className="text-sm">Batch</p>
                  <p className="font-semibold text-foreground">{batchCode}</p>
                </div>
                <div>
                  <p className="text-sm">Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDownload}
                size="lg"
                className="gap-2 px-8 py-6 text-lg transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </Button>
              
              <Button
                onClick={handleShare}
                size="lg"
                variant="outline"
                className="gap-2 px-8 py-6 text-lg transition-all hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Share Achievement
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Thank you for learning with HAQ!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

import { useState } from "react";
import type { ScanResult } from "@eathigh/shared";
import BarcodeScanner from "../components/BarcodeScanner";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { scanBarcode } from "../api/scan";
import { useAuth } from "../context/AuthContext";
import { Camera, ScanLine, Zap, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";

export default function HomePage() {
  const { user } = useAuth();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleDetected = async (code: string) => {
    setScanning(false);
    setLoading(true);
    setError(null);

    const res = await scanBarcode(code);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Product not found.");
    }

    setLoading(false);
  };

  const handleScanAnother = () => {
    setResult(null);
    setError(null);
    setScanning(true);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full px-4 md:px-8 pt-6 pb-8">
      {result ? (
        <SEO title="Scan Results | EatHigh" />
      ) : (
        <SEO title="EatHigh | Smart Food Scanner" />
      )}
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-earth-olive-dark mb-4 leading-tight">
          Scan. Analyze. <br className="md:hidden" />
          <span className="bg-gradient-to-r from-earth-olive to-earth-olive-dark bg-clip-text text-transparent">
            Eat Smart.
          </span>
        </h1>
        <p className="text-base md:text-lg text-earth-olive-dark/70">
          Powered by AI to give you personalized nutritional insights
          {user && (
            <span className="block mt-1">
              tailored for <strong className="text-earth-olive-dark font-bold">{user.name}</strong>
            </span>
          )}
        </p>
      </section>

      {/* Main Content Area */}
      {result ? (
        <section className="w-full max-w-4xl mx-auto animate-fade-in-up">
          <ProductCard result={result} onScanAnother={handleScanAnother} />
        </section>
      ) : (
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start">
          
          {/* Left Pane: Scanner or Loading/Error */}
          <div className="w-full flex flex-col items-center">
            {loading && (
              <div className="w-full">
                <ProductCardSkeleton />
                <p className="text-center text-sm text-earth-olive-dark/50 mt-6 animate-pulse">
                  Analyzing product with Gemini AI...
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-4 p-6 md:p-8 bg-earth-crimson/10 border border-earth-crimson/20 rounded-3xl w-full text-center animate-fade-in-up">
                <p className="text-earth-crimson font-medium">{error}</p>
                <button 
                  className="px-6 py-2.5 bg-earth-olive-dark border border-earth-olive-dark text-earth-light rounded-lg hover:bg-earth-olive hover:border-earth-olive transition-colors"
                  onClick={handleScanAnother}
                >
                  Try Again
                </button>
              </div>
            )}

            {scanning && !loading && !error && (
              <div className="w-full">
                <BarcodeScanner onDetected={handleDetected} />
              </div>
            )}
          </div>

          {/* Right Pane: Instructions */}
          <div className="w-full">
            <div className="w-full bg-white/60 backdrop-blur-md border border-earth-olive-dark/20 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-earth-olive-dark mb-6">How to Use</h2>
              <div className="flex flex-col gap-6">
                <InstructionStep 
                  icon={Camera}
                  title="Camera Access" 
                  description="Allow camera access when prompted by your browser." 
                />
                <InstructionStep 
                  icon={ScanLine}
                  title="Scan Barcode" 
                  description="Hold the barcode in front of your camera. Ensure good lighting." 
                />
                <InstructionStep 
                  icon={Zap}
                  title="Instant Insights" 
                  description="Get AI-powered health insights and personalized scoring." 
                />
                <InstructionStep 
                  icon={CheckCircle2}
                  title="Make Better Choices" 
                  description="Use the data to choose products that align with your dietary goals." 
                />
              </div>
            </div>
          </div>

        </section>
      )}

      {/* About Section */}
      <section id="about" className="w-full max-w-5xl mx-auto mt-24 md:mt-32 mb-16 text-center animate-fade-in-up scroll-mt-24">
        <h2 className="font-heading text-3xl font-bold text-earth-olive-dark mb-6">About EatHigh</h2>
        <p className="text-lg text-earth-olive-dark/70 max-w-3xl mx-auto leading-relaxed">
          EatHigh is an AI-driven nutritional telemetry platform designed to help you make smarter dietary choices. By leveraging advanced barcode scanning and Gemini AI, we provide real-time, personalized health scores and nutritional breakdowns tailored exactly to your unique goals.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-3xl mx-auto mb-24 md:mb-32 text-center animate-fade-in-up scroll-mt-24">
        <div className="bg-earth-olive/10 border border-earth-olive/20 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="font-heading text-3xl font-bold text-earth-olive-dark mb-4">Get in Touch</h2>
          <p className="text-earth-olive-dark/70 mb-8 max-w-xl mx-auto">
            Have questions, feedback, or want to collaborate? I'd love to hear from you. Check out my portfolio to connect.
          </p>
          <a href="https://portfolio-sudarshan-dandgawal.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 bg-earth-olive text-earth-light font-bold rounded-xl hover:bg-earth-olive-light shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Connect With Me
          </a>
        </div>
      </section>
    </div>
  );
}

function InstructionStep({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-purple/10 text-accent-purple shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-bold text-earth-olive-dark">{title}</h3>
        <p className="text-sm text-earth-olive-dark/70 leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

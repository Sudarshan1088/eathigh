import { useState } from "react";
import type { ScanResult } from "@eathigh/shared";
import BarcodeScanner from "../components/BarcodeScanner";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { scanBarcode } from "../api/scan";
import { useAuth } from "../context/AuthContext";

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
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Scan. Analyze. <br className="md:hidden" />
          <span className="bg-gradient-to-r from-primary-DEFAULT to-emerald-300 bg-clip-text text-transparent">
            Eat Smart.
          </span>
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Powered by AI to give you personalized nutritional insights
          {user && (
            <span className="block mt-1">
              tailored for <strong className="text-primary-DEFAULT">{user.name}</strong>
            </span>
          )}
        </p>
      </section>

      {/* Main Content Area */}
      <section className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-12">
        {loading && (
          <div className="w-full">
            <ProductCardSkeleton />
            <p className="text-center text-sm text-neutral-500 mt-6 animate-pulse">
              Analyzing product with Gemini AI...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 p-6 md:p-8 bg-red-500/10 border border-red-500/20 rounded-2xl w-full max-w-lg text-center animate-fade-in-up">
            <p className="text-red-400 font-medium">{error}</p>
            <button 
              className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              onClick={handleScanAnother}
            >
              Try Again
            </button>
          </div>
        )}

        {result && (
          <div className="w-full">
            <ProductCard result={result} onScanAnother={handleScanAnother} />
          </div>
        )}

        {scanning && !loading && (
          <div className="w-full max-w-lg mx-auto">
            <BarcodeScanner onDetected={handleDetected} />
          </div>
        )}

        {/* Instructions */}
        <div className="w-full mt-8">
          <h2 className="font-heading text-xl text-white text-center mb-6">How to Use</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InstructionCard number={1} text="Allow camera access when prompted" />
            <InstructionCard number={2} text="Hold the barcode in front of your camera" />
            <InstructionCard number={3} text="Ensure good lighting for accurate scanning" />
            <InstructionCard number={4} text="Get instant AI-powered health insights" />
          </div>
        </div>
      </section>
    </div>
  );
}

function InstructionCard({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex flex-col items-center text-center p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl gap-3 hover:border-neutral-700 transition-colors">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 text-primary-DEFAULT font-heading font-bold text-sm">
        {number}
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

import { useState } from "react";
import type { ScanResult } from "@eathigh/shared";
import BarcodeScanner from "../components/BarcodeScanner";
import ProductCard from "../components/ProductCard";
import { scanBarcode } from "../api/scan";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

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
    <main className="home">
      <section className="home__hero">
        <h1 className="home__title">
          Scan. Analyze. <span className="home__title-accent">Eat Smart.</span>
        </h1>
        <p className="home__subtitle">
          Powered by AI to give you personalized nutritional insights
          {user && (
            <span className="home__user-greeting">
              {" "}— tailored for <strong>{user.name}</strong>
            </span>
          )}
        </p>
      </section>

      <section className="home__content">
        {loading && (
          <div className="home__loading">
            <div className="spinner" />
            <p>Analyzing product with AI...</p>
          </div>
        )}

        {error && (
          <div className="home__error">
            <p>{error}</p>
            <button className="btn btn--primary" onClick={handleScanAnother}>
              Try Again
            </button>
          </div>
        )}

        {result && (
          <ProductCard result={result} onScanAnother={handleScanAnother} />
        )}

        {scanning && !loading && (
          <div className="home__scanner-section">
            <BarcodeScanner onDetected={handleDetected} />
          </div>
        )}

        <div className="home__instructions">
          <h2 className="home__instructions-title">How to Use</h2>
          <div className="instructions-grid">
            <div className="instruction-card">
              <span className="instruction-card__number">1</span>
              <p>Allow camera access when prompted</p>
            </div>
            <div className="instruction-card">
              <span className="instruction-card__number">2</span>
              <p>Hold the barcode in front of your camera</p>
            </div>
            <div className="instruction-card">
              <span className="instruction-card__number">3</span>
              <p>Ensure good lighting for accurate scanning</p>
            </div>
            <div className="instruction-card">
              <span className="instruction-card__number">4</span>
              <p>Get instant AI-powered health insights</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

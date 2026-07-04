import { useEffect, useRef, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import "../styles/scanner.css";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const hasDetected = useRef(false);

  const handleDetection = useCallback(
    (result: { codeResult?: { code?: string | null } }) => {
      if (hasDetected.current) return;
      const code = result.codeResult?.code;
      if (code) {
        hasDetected.current = true;
        Quagga.stop();
        onDetected(code);
      }
    },
    [onDetected]
  );

  useEffect(() => {
    if (!videoRef.current) return;

    hasDetected.current = false;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader", "code_128_reader", "upc_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetection);

    return () => {
      Quagga.stop();
      Quagga.offDetected(handleDetection);
    };
  }, [handleDetection]);

  return (
    <div className="scanner-wrapper">
      <div className="scanner-viewfinder">
        <div id="video-container" ref={videoRef} />
        <div className="scanner-overlay">
          <div className="scanner-line" />
        </div>
      </div>
      <p className="scanner-hint">Point your camera at a barcode</p>
    </div>
  );
}

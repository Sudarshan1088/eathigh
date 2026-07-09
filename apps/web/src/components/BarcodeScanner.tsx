import { useEffect, useRef, useCallback } from "react";
import Quagga from "@ericblade/quagga2";

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
    <div className="w-full flex flex-col items-center gap-6">
      <div className="relative w-full max-w-sm aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden bg-white border border-earth-olive-dark/20 shadow-xl">
        {/* The video feed container */}
        <div id="video-container" ref={videoRef} className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover" />
        
        {/* Overlay cutouts and laser */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Corner targets */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-earth-olive rounded-tl-2xl opacity-70" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-earth-olive rounded-tr-2xl opacity-70" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-earth-olive rounded-bl-2xl opacity-70" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-earth-olive rounded-br-2xl opacity-70" />
          
          {/* The glowing laser line */}
          <div className="absolute top-1/4 left-10 right-10 h-0.5 bg-earth-olive shadow-[0_0_15px_3px_rgba(106,153,78,0.8)] animate-scanner-laser" />
        </div>
      </div>
      <p className="text-sm font-medium text-earth-olive-dark/70">
        Center barcode in the frame
      </p>
    </div>
  );
}

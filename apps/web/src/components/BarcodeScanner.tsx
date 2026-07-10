import { useEffect, useRef, useCallback, useState } from "react";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const hasDetected = useRef(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (typeof window === "undefined") return;

    hasDetected.current = false;

    let Quagga: any;

    import("@ericblade/quagga2").then((module) => {
      Quagga = module.default;
      
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: videoRef.current!,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "upc_reader"],
          },
          locate: true,
        },
        (err: any) => {
          if (err) {
            console.error("Quagga init error:", err);
            return;
          }
          Quagga.start();
        }
      );

      const onDetectedWrapper = (result: any) => {
        if (hasDetected.current) return;
        const code = result.codeResult?.code;
        if (code) {
          hasDetected.current = true;
          Quagga.stop();
          onDetected(code);
        }
      };

      Quagga.onDetected(onDetectedWrapper);
      
      // Store cleanup function in ref or window if needed, but we can return it directly here
      // Wait, returning from inside .then() doesn't work for useEffect cleanup.
      // We will assign Quagga to a local variable and clean up below.
    });

    return () => {
      if (Quagga) {
        Quagga.stop();
        // We can't easily offDetected without the exact wrapper reference, but stop() is usually enough
      }
    };
  }, [onDetected]);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="relative w-full max-w-sm aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden bg-white border border-earth-olive-dark/20 shadow-xl">
        {/* The video feed container */}
        <div id="video-container" aria-label="Barcode Scanner Viewport" ref={videoRef} className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover" />
        
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

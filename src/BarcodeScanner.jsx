import React, { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";
import './BarcodeScanner.css';

const BarcodeScanner = ({ onDetected }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize Quagga when the component mounts
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current, // Mounts to this div
          constraints: {
            facingMode: "environment", // use back camera if available
          },
        },
        decoder: {
          readers: ["ean_reader", "code_128_reader", "upc_reader"], // 1D barcodes
        },
        locate: true, // optional — tries to locate barcode in image
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    // When a barcode is detected
    Quagga.onDetected((result) => {
      if (onDetected) {
        onDetected(result.codeResult.code);
      }
      // optional: stop scanning after first detection
      Quagga.stop();
    });

    // Cleanup on unmount
    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [onDetected]);

  return (
    <div>
      <div id="video-container"
        ref={videoRef}
        // style={{
        //   width: "100%",
        //   height: "100%",
        //   maxHeight: "290px",
        //   maxWidth: "400px",
        //   borderRadius: "10px",
        //   overflow: "hidden",
        // }}
      />
      <p style={{ textAlign: "center" }}>Point your camera at a barcode 📷</p>
    </div>
  );
};

export default BarcodeScanner;

import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import './App.css';

const App =() => {
  const [barcode, setBarcode] = useState(null);

  const handleDetected = (code) => {
    console.log("Scanned barcode:", code); // <-- you can see it in browser console
    setBarcode(code);
  };


  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem'
        }}
      >
        <div className="logo">
          <img
            src="logo.png"
            className="logo-img"
            alt="logo"
            style={{ height: 60 }}
          />
        </div>

        <nav className="Header-navbar">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="profile">
          <img
            src="profile.png"
            className="profile-pic"
            alt="profile"
  
          />
        </div>
      </header>

      <main>
        <h1 className="welcome-text" style={{ textAlign: 'center' }}>
          Welcome to EatHigh
        </h1>

        <div className="scanner"
        >
          <div style={{ textAlign: "center" }}>
            
            {!barcode ? (
              <BarcodeScanner onDetected={handleDetected} />
            ) : (
              <div>
                <h3>Scanned Code: {barcode}</h3>
                {/* Next step: Fetch nutritional info based on the barcode */}
              </div>
            )}
          </div>
        </div>
            <h3>Scanned Code: {barcode}</h3>
        <div
          className="buttons"
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button className="scan-button">Scan QR Code</button>
          <button className="upload-img">Upload Image</button>
        </div>
      </main>

      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem'
        }}
      >
        <nav
          className="Footer-navbar"
          style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="footer-text" style={{ margin: 0 }}>
          &copy; 2023 EatHigh. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;

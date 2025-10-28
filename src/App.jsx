import React, { useState, useEffect } from "react";
import BarcodeScanner from "./BarcodeScanner";
import logo from './Assets/logo.png';

import './App.css';

function rateProduct(product = {}) {
  // Extract nutrients from API (per 100g)
  const nutrients = product.nutriments || {};
  const servingSize = product.serving_size || "100g"; // example: "50g" or "1 serving (200 ml)"
  const servingMatch = servingSize.match(/(\d+\.?\d*)\s*(g|ml)/i);
  const servingAmount = servingMatch ? parseFloat(servingMatch[1]) : 100;
  const servingUnit = servingMatch ? servingMatch[2].toLowerCase() : "g";

  // Adjust nutrients to per serving
  const factor = servingAmount / 100; // scale factor
  const calories = (nutrients["energy-kcal_100g"] || 0) * factor;
  const fat = (nutrients.fat_100g || 0) * factor;
  const saturatedFat = (nutrients["saturated-fat_100g"] || 0) * factor;
  const sugar = (nutrients.sugars_100g || 0) * factor;
  const protein = (nutrients.proteins_100g || 0) * factor;
  const fiber = (nutrients.fiber_100g || 0) * factor;
  const sodium = (nutrients.sodium_100g || 0) * factor;
  const vitaminC = (nutrients["vitamin-c_100g"] || 0) * factor;
  const iron = (nutrients.iron_100g || 0) * factor;
  const transFat = (nutrients["trans-fat_100g"] || 0) * factor;

  // Initialize score
  let score = 10;

  // 🔻 Penalties — unhealthy nutrients
  if (calories > 300) score -= 2;                      // High-calorie serving
  if (fat > 10) score -= 2;
  if (saturatedFat > 3 && saturatedFat <= 6) score -= 2;
  if (saturatedFat > 6) score -= 3;
  if (transFat > 0) score -= 2;
  if (sugar > 10 && sugar <= 20) score -= 3;
  if (sugar > 20) score -= 4;
  if (sodium > 0.4 && sodium <= 0.8) score -= 1;
  if (sodium > 0.8) score -= 2;

  // 🔺 Rewards — healthy nutrients
  if (fiber > 3 && fiber <= 6) score += 2;
  if (fiber > 6) score += 3;
  if (protein > 5 && protein <= 10) score += 2;
  if (protein > 10) score += 3;
  if (vitaminC > 15 && vitaminC <= 30) score += 1;
  if (vitaminC > 30) score += 2;
  if (iron > 3 && iron <= 6) score += 1;
  if (iron > 6) score += 2;

  // ✅ Normalize final score between 0 and 10
  if (score > 10) score = 10;
  if (score < 0) score = 0;

  // Return numeric score rounded to one decimal place
  return Number(score.toFixed(1));
}

// 🎨 Rating bar UI component
const RatingBar = ({ score }) => {
  const percentage = (score / 10) * 100;
  const color =
    score >= 8 ? "#22c55e" : score >= 5 ? "#facc15" : "#ef4444"; // green/yellow/red

  return (
    <div className="rating-bar">
      <div
        style={{
          background: "#e5e7eb",
          borderRadius: "10px",
          height: "15px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            background: color,
            height: "100%",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p style={{ marginTop: "5px", fontWeight: "bold" }}>
        Health Score: {score}/10
      </p>
    </div>
  );
};

const App = () => {
  const [barcode, setBarcode] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetected = (code) => {
    console.log("Scanned barcode:", code);
    setBarcode(code);
  };

  useEffect(() => {
    if (!barcode) return;

    setLoading(true);
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 1) {
          setProduct(data.product);
        } else {
          setProduct(null);
          alert("Product not found in database.");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("API error:", err);
      });
  }, [barcode]);

  return (
    <div className="App">
      <header className="App-header">

          <img src={logo} className="logo-img"  alt="logo"/>
        
        <nav className="Header-navbar">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="profile">
          <img src="/Assets/profile.png" className="profile-pic" alt="profile" />
        </div>
      </header>

      <main>
        <div className="container">

          <h1 className="welcome-text">Welcome to EatHigh</h1>
          
          <div className="product-info">
            <h2 className="product-info-title">Nutritional Barcode Scanner</h2>

            {loading && <p>Loading product info...</p>}

            {product && (
              <div className="product-card"
                style={{
                  marginTop: "20px",
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 10px rgba(226, 0, 0, 0.1)",
                  maxWidth: "40vw",
                  marginInline: "auto",
                }}
              >
                <img
                  src={product.image_front_small_url}
                  alt="product"
                  // style={{
                  //   borderRadius: "10px",
                  //   width: "100%",
                  //   objectFit: "cover",
                  // }}
                />
                <h3 style={{ marginTop: "15px" }}>
                  {product.product_name || "Unknown Product"}
                </h3>
                <p>
                  <b>Brand:</b> {product.brands || "N/A"}
                </p>
                <div className="nutrition">
                <p>
                    <b>Calories:</b>{" "}
                    {product.nutriments?.["energy-kcal_100g"] ?? "?"} kcal/100g
                  </p>
                  <p>
                    <b>Fat:</b> {product.nutriments?.fat_100g ?? "?"} g
                  </p>
                  <p>
                    <b>Sugar:</b> {product.nutriments?.sugars_100g ?? "?"} g
                  </p>
                  <p>
                    <b>Protein:</b> {product.nutriments?.proteins_100g ?? "?"} g
                  </p>
                  <p>
                    <b>Fiber:</b> {product.nutriments?.fiber_100g ?? "?"} g
                  </p>
                </div>
                  <RatingBar score={rateProduct(product)} />
                

                <div>
                  <button
                    className="scan-button"
                    onClick={() => {
                      setBarcode(null);
                      setProduct(null);
                    }}
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="scanner">
            <div className="barcode-scanner">
              {!barcode ? (
                <BarcodeScanner onDetected={handleDetected} />
              ) : (
            <div>
                
              </div>
              )}
            </div>
          </div>
          <div className="instructions">
            <h2 className="instructions-title">How to Use the Scanner</h2>
            <ol className="instructions-list">
              <li>Allow camera access when prompted.</li>
              <li>Hold the barcode in front of your device's camera.</li>
              <li>Ensure good lighting for accurate scanning.</li>
              <li>Wait for the product information to load.</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="Footer">
        <nav className="Footer-navbar">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="footer-paragraph">
          &copy; 2023 EatHigh. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;

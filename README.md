# EatHigh - Nutritional Barcode Scanner

EatHigh is a high-performance, responsive React application that allows users to scan food product barcodes using their device's camera. It fetches real-time nutritional data and calculates a comprehensive Health Score to help users make informed dietary choices.

## Features

- **Live Barcode Scanning**: Uses your device's camera to seamlessly detect and read barcodes using `Quagga2`.
- **Nutritional Analysis**: Integrates with the [OpenFoodFacts API](https://world.openfoodfacts.org/) to retrieve accurate and detailed product information (calories, fat, sugar, protein, etc.).
- **Health Score Algorithm**: Automatically evaluates the scanned product's nutritional profile based on macros (penalizing high sugar, fat, sodium; rewarding protein, fiber, vitamins) and assigns an intuitive 0-10 rating.
- 📱 **Responsive Design**: Built to work seamlessly on both desktop and mobile devices.

## Tech Stack

- **Frontend Framework**: React.js
- **Barcode Decoding**: [@ericblade/quagga2](https://github.com/ericblade/quagga2)
- **Styling**: Vanilla CSS
- **Data Source**: OpenFoodFacts API

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd eathigh
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Use

1. Launch the application and allow the browser to access your device's camera when prompted.
2. Hold a product's barcode steadily in front of the camera. Ensure there is good lighting for accurate and fast scanning.
3. Wait a moment for the scanner to detect the barcode and fetch the product information.
4. Review the product details, nutritional facts, and the generated Health Score.
5. Click **Scan Another** to evaluate a different product.

## Project Structure

- `src/App.jsx`: Main application component, handles state, API fetching, and the Health Score algorithm.
- `src/BarcodeScanner.jsx`: Wrapper component for Quagga2 initialization, camera setup, and barcode detection logic.
- `src/App.css` & `src/BarcodeScanner.css`: Custom styling for the application UI.

## License

&copy; 2023 EatHigh. All rights reserved.

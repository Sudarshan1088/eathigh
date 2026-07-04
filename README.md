# EatHigh — AI-Powered Nutritional Barcode Scanner

A full-stack MERN application that scans food product barcodes, fetches real-time nutritional data, and uses **Gemini AI** to generate personalized health scores and conversational dietary analysis.

## Architecture

```
eathigh/
├── packages/shared/     # Shared TypeScript types & constants
├── apps/api/            # Express + MongoDB backend
└── apps/web/            # Vite + React + TypeScript frontend
```

## Features


- **Live Barcode Scanning**: Camera-based barcode detection via `Quagga2`.
- **AI-Powered Analysis**: Gemini 2.0 Flash generates personalized health scores and explains *why* a product scored the way it did.
- **MongoDB Caching**: Scanned products are cached for 7 days, drastically improving subsequent load times.
- **User Authentication**: JWT-based auth with bcrypt password hashing.
- **Dietary Personalization**: Users set dietary goals (High Protein, Keto, Low Sodium, etc.) and the AI adjusts its analysis accordingly.
- **Scan History**: Authenticated users get a paginated history of all their scans.
- **Rate Limiting**: Endpoint-specific rate limiting to prevent abuse.
- **Strict TypeScript**: End-to-end type safety with shared types across frontend and backend.
- **Responsive Design**: Built to work seamlessly on both desktop and mobile devices.


## Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | React 19, Vite, TypeScript, React Router             |
| Backend   | Express, TypeScript, Mongoose                        |
| Database  | MongoDB (Atlas or local)                             |
| AI        | Google Gemini 2.0 Flash (`@google/generative-ai`)    |
| Auth      | JWT + bcrypt                                         |
| Barcode   | @ericblade/quagga2                                   |
| Data      | OpenFoodFacts API                                    |
| Validation| Zod                                                  |


## Getting Started

To get a local copy of the EatHigh project up and running on your machine for development and testing, follow the instructions below.

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://aistudio.google.com/)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Sudarshan1088/eathigh.git
   cd eathigh
   ```

2. Install all dependencies (npm workspaces):
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example apps/api/.env
   ```
   Edit `apps/api/.env` and fill in your values:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=a-long-random-string
   GEMINI_API_KEY=your-key-from-aistudio
   ```

4. Start both servers:
   ```bash
   npm run dev
   ```
   - Frontend → http://localhost:5173
   - Backend  → http://localhost:5000

## API Endpoints

| Method | Endpoint              | Auth     | Description                      |
| ------ | --------------------- | -------- | -------------------------------- |
| POST   | `/api/auth/register`  | Public   | Create a new account             |
| POST   | `/api/auth/login`     | Public   | Login and receive JWT            |
| GET    | `/api/auth/me`        | Required | Get current user profile         |
| POST   | `/api/scan/:barcode`  | Optional | Scan a barcode, get AI analysis  |
| GET    | `/api/user/profile`   | Required | Get full user profile            |
| PUT    | `/api/user/profile`   | Required | Update name & dietary goals      |
| GET    | `/api/user/history`   | Required | Paginated scan history           |
| GET    | `/api/health`         | Public   | Server health check              |

## License

&copy; 2026 Sudarshan Dandgawal. Open source under the MIT License.

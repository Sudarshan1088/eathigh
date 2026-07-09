import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-earth-light text-earth-olive-dark font-body relative pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

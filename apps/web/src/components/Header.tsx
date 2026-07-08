import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="hidden md:flex sticky top-0 z-50 items-center justify-between px-8 py-4 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl transition-transform group-hover:scale-110">🥗</span>
        <span className="font-heading text-2xl font-bold bg-gradient-to-br from-primary-DEFAULT to-emerald-300 bg-clip-text text-transparent">
          EatHigh
        </span>
      </Link>

      <nav className="flex items-center gap-8">
        <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          Home
        </Link>
        {user && (
          <>
            <Link to="/history" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              History
            </Link>
            <Link to="/profile" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Profile
            </Link>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-primary-DEFAULT">{user.name}</span>
            <button 
              className="px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-semibold text-neutral-950 bg-primary-DEFAULT rounded-lg hover:bg-primary-hover shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:scale-105 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

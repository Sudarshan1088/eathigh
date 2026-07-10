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
    <header className="hidden md:flex sticky top-0 z-50 items-center px-8 py-4 bg-earth-light/80 backdrop-blur-md border-b border-earth-olive-dark/20">
      
      {/* Left side: Logo */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🥗</span>
          <span className="font-heading text-2xl font-bold bg-gradient-to-br from-earth-olive to-earth-olive-dark bg-clip-text text-transparent">
            EatHigh
          </span>
        </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="flex items-center justify-center gap-8">
        <Link to="/" className="text-sm font-medium text-earth-olive-dark/70 hover:text-earth-olive-dark transition-colors">
          Home
        </Link>
        {user && (
          <>
            <Link to="/history" className="text-sm font-medium text-earth-olive-dark/70 hover:text-earth-olive-dark transition-colors">
              History
            </Link>
            <Link to="/profile" className="text-sm font-medium text-earth-olive-dark/70 hover:text-earth-olive-dark transition-colors">
              Profile
            </Link>
          </>
        )}
      </nav>

      {/* Right side: Auth Actions */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-earth-olive-dark">{user.name}</span>
            <button 
              className="px-4 py-2 text-sm font-medium text-earth-olive-dark border border-earth-olive-dark rounded-lg hover:bg-earth-olive-dark hover:text-earth-light transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-earth-olive-dark border border-earth-olive-dark rounded-lg hover:bg-earth-olive-dark hover:text-earth-light transition-all"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-semibold text-earth-light bg-earth-olive rounded-lg hover:bg-earth-olive-light shadow-[0_0_20px_rgba(106,153,78,0.2)] hover:shadow-[0_0_25px_rgba(106,153,78,0.4)] hover:scale-105 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
    </header>
  );
}

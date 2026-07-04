import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo-icon">🥗</span>
        <span className="header__logo-text">EatHigh</span>
      </Link>

      <nav className="header__nav">
        <Link to="/" className="header__link">
          Home
        </Link>
        {user && (
          <>
            <Link to="/history" className="header__link">
              History
            </Link>
            <Link to="/profile" className="header__link">
              Profile
            </Link>
          </>
        )}
      </nav>

      <div className="header__actions">
        {user ? (
          <div className="header__user">
            <span className="header__username">{user.name}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="header__auth">
            <Link to="/login" className="btn btn--ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn--primary btn--sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

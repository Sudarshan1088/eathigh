import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <span className="footer__logo">🥗 EatHigh</span>
          <p className="footer__tagline">
            Smart food scanning powered by AI
          </p>
        </div>
        <nav className="footer__nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 Sudarshan Dandgawal. Open source under the MIT License.</p>
      </div>
    </footer>
  );
}

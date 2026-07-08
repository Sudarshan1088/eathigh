export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-heading text-xl font-bold bg-gradient-to-br from-primary-DEFAULT to-emerald-300 bg-clip-text text-transparent mb-1">
            🥗 EatHigh
          </span>
          <p className="text-sm text-neutral-400">
            Smart food scanning powered by AI
          </p>
        </div>
        <nav className="flex gap-6">
          <a href="#home" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Contact</a>
        </nav>
      </div>
      <div className="border-t border-neutral-800 py-6 text-center">
        <p className="text-xs text-neutral-500">
          &copy; 2026 Sudarshan Dandgawal. Open source under the MIT License.
        </p>
      </div>
    </footer>
  );
}


import './App.css';

function App() {
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

        <div
          className="scanner"
          style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}
        >
          <h2>QR Code Scanner Component Coming Soon!</h2>
        </div>

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

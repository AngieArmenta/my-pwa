
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <h1>📱 MyPWA</h1>
      </header>

      {/* MAIN */}
      <main className="app-main">
        <h2>Bienvenido 🚀</h2>
        <p>
          Esta es una <strong>Progressive Web App</strong> con arquitectura App Shell.
        </p>

        <div className="card">
          <h3>Características:</h3>
          <ul>
            <li>✅ Instalación en Chrome/Edge</li>
            <li>✅ Funciona Offline</li>
            <li>✅ Splash Screen personalizada</li>
            <li>✅ Estrategia de caché con Service Worker</li>
          </ul>
        </div>

        <button className="btn">Probar Instalación</button>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>⚡ MyPWA - 2025</p>
      </footer>
    </div>
  );
}

export default App;

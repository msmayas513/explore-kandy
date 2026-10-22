
import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigation = [
    { label: 'Home', href: '#home' },
    { label: 'Attractions', href: '#attractions' },
    { label: 'Map', href: '#map' },
    { label: 'Day Planner', href: '#planner' },
    { label: 'Admin Login', href: '#admin' },
  ]

  return (
    <div>
      <header className="navbar">
        <a className="logo" href="#home">
          <span className="logo-icon">✦</span>
          Explore Kandy
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="home" className="hero">
        <p className="hero-eyebrow">
          DISCOVER THE HEART OF SRI LANKA
        </p>

        <h1>Explore Kandy</h1>

        <p className="hero-subtitle">
          Discover breathtaking destinations, explore
          rich culture and history, and plan your
          perfect one-day adventure in Kandy.
        </p>

        <a className="explore-btn" href="#attractions">
          Explore Attractions →
        </a>
      </main>

      <section id="attractions" className="placeholder-section">
        <h2>Discover Amazing Places</h2>
        <p>Tourist attractions are coming next.</p>
      </section>

      <section id="map" className="placeholder-section">
        <h2>Explore the Map</h2>
        <p>Our interactive map will appear here.</p>
      </section>

      <section id="planner" className="placeholder-section">
        <h2>Plan Your Day</h2>
        <p>Create your perfect one-day itinerary.</p>
      </section>

      <section id="admin" className="placeholder-section">
        <h2>Administrator Login</h2>
        <p>Secure administrator access will be added later.</p>
      </section>
    </div>
  )
}

export default App



import { useState, useEffect } from 'react'
import './App.css'
import KandyMap from './KandyMap'


function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [attractions, setAttractions] = useState([])

  
const [selectedCategory, setSelectedCategory] = useState('All')
const [selectedAttraction, setSelectedAttraction] = useState(null)
const [tripPlan, setTripPlan] = useState([])

const visitDurations = {
  1: 90,
  2: 90,
  3: 120,
  4: 90,
  5: 120,
  6: 60,
  7: 60,
  8: 60,
  9: 60,
  10: 60
}


const addToTrip = (attraction) => {
  setTripPlan((currentPlan) => {
    const alreadyAdded = currentPlan.some(
      (place) => place.id === attraction.id
    )

    if (alreadyAdded) {
      return currentPlan
    }

    return [...currentPlan, attraction]
  })
}

const removeFromTrip = (attractionId) => {
  setTripPlan((currentPlan) =>
    currentPlan.filter(
      (attraction) => attraction.id !== attractionId
    )
  )
}


useEffect(() => {
  fetch('http://localhost:5000/api/attractions')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch attractions')
      }
      return response.json()
    })
    .then((data) => {
      setAttractions(data)
    })
    .catch((error) => {
      console.error('Error loading attractions:', error)
    })
}, [])


const filteredAttractions = attractions.filter(
  (attraction) =>
    selectedCategory === 'All' ||
    attraction.category === selectedCategory
)


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

      
<section id="attractions" className="attractions-section">
  <div className="section-heading">
    <p className="section-eyebrow">EXPLORE DESTINATIONS</p>
    <h2>Discover Amazing Places</h2>
    <p>
      Explore the natural beauty, religious heritage,
      and historical attractions of Kandy.
    </p>
  </div>

  <div className="category-filters">
    {['All', 'Nature', 'Religious', 'Historical'].map(
      (category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? 'filter-btn active'
              : 'filter-btn'
          }
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      )
    )}
  </div>

  <div className="attractions-grid">
    {filteredAttractions.map((attraction) => (
      <article className="attraction-card" key={attraction.id}>
        <div className="attraction-image">
          {attraction.image ? (
            <img
              src={attraction.image}
              alt={attraction.name}
            />
          ) : (
            <span>Photo coming soon</span>
          )}
        </div>

        <div className="attraction-content">
          <span className="attraction-category">
            {attraction.category}
          </span>

          <h3>{attraction.name}</h3>

          <p className="attraction-distance">
  📍 {Number(attraction.distance)} KM
</p>

          <p className="attraction-description">
            {attraction.description}
          </p>

          <button
            className="details-btn"
            onClick={() => setSelectedAttraction(attraction)}
          >
            View Details →
          </button>

        
<button
  className="details-btn"
  onClick={() => addToTrip(attraction)}
  disabled={tripPlan.some((place) => place.id === attraction.id)}
>
  {tripPlan.some((place) => place.id === attraction.id)
    ? '✓ Added to Trip'
    : '+ Add to Trip'}
</button>

        </div>
      </article>
    ))}
  </div>

  {selectedAttraction && (
    <div
      className="modal-overlay"
      onClick={() => setSelectedAttraction(null)}
    >
      <div
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="attraction-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          aria-label="Close details"
          onClick={() => setSelectedAttraction(null)}
        >
          ✕
        </button>

        <span className="attraction-category">
          {selectedAttraction.category}
        </span>

        <h2 id="attraction-modal-title">
          {selectedAttraction.name}
        </h2>

        
<p>
  <strong>Distance:</strong>{' '}
  {Number(selectedAttraction.distance)} KM
</p>


        <p>{selectedAttraction.description}</p>
      </div>
    </div>
  )}
</section>


      
<section id="map" className="placeholder-section">
  <h2>Explore the Map</h2>
  <p>Discover attractions around Kandy on our interactive map.</p>
  <KandyMap attractions={attractions} />

</section>


      
<section id="planner" className="placeholder-section">
  <h2>Plan Your Day</h2>
  <p>Select attractions to create your one-day itinerary.</p>

  {tripPlan.length === 0 ? (
    <p>No attractions selected yet. Add places from the attraction cards above.</p>
  ) : (
    <div className="trip-plan-list">
      <h3>Your Selected Attractions ({tripPlan.length})</h3>

      {tripPlan.map((attraction, index) => (
        <div className="trip-plan-item" key={attraction.id}>
          <p>
            <strong>{index + 1}. {attraction.name}</strong>
          </p>
          <p>
            {attraction.category} · {Number(attraction.distance)} KM
          </p>
          
<button
  className="details-btn"
  onClick={() => removeFromTrip(attraction.id)}
>
  Remove from Trip
</button>

        </div>
      ))}
    </div>
  )}
</section>


      <section id="admin" className="placeholder-section">
        <h2>Administrator Login</h2>
        <p>Secure administrator access will be added later.</p>
      </section>
    </div>
  )
}

export default App

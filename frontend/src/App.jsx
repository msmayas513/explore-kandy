

import { useState, useEffect } from 'react'
import './App.css'
import KandyMap from './KandyMap'


function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const [attractions, setAttractions] = useState([])

  
const [selectedCategory, setSelectedCategory] = useState('All')
const [selectedAttraction, setSelectedAttraction] = useState(null)
const [tripPlan, setTripPlan] = useState([])

const [adminUsername, setAdminUsername] = useState('')
const [adminPassword, setAdminPassword] = useState('')

const [adminToken, setAdminToken] = useState(
  () => sessionStorage.getItem("adminToken")
)

const [loginError, setLoginError] = useState('')
const [editingAttraction, setEditingAttraction] = useState(null)


const [showAddForm, setShowAddForm] = useState(false)

const [newAttraction, setNewAttraction] = useState({
  name: '',
  category: 'Nature',
  distance: '',
  description: '',
  latitude: '',
  longitude: ''
})



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

const totalVisitMinutes = tripPlan.reduce(
  (total, attraction) =>
    total + (visitDurations[attraction.id] || 60),
  0
)

const totalVisitHours = Math.floor(totalVisitMinutes / 60)
const remainingVisitMinutes = totalVisitMinutes % 60



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

const handleAdminLogin = async (event) => {
  event.preventDefault()
  setLoginError('')

  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setLoginError(data.message || 'Login failed')
      return
    }
    sessionStorage.setItem("adminToken", data.token)
    setAdminToken(data.token)
    setAdminPassword('')
  } catch (error) {
    console.error('Admin login error:', error)
    setLoginError('Cannot connect to the server. Please try again.')
  }
}


const handleSaveAttraction = async (event) => {
  event.preventDefault()

  if (!editingAttraction || !adminToken) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/attractions/${editingAttraction.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: editingAttraction.name,
          category: editingAttraction.category,
          distance: Number(editingAttraction.distance),
          description: editingAttraction.description,
          latitude: editingAttraction.latitude,
          longitude: editingAttraction.longitude
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update attraction')
    }

    setAttractions((currentAttractions) =>
      currentAttractions.map((attraction) =>
        attraction.id === editingAttraction.id
          ? { ...editingAttraction }
          : attraction
      )
    )

    setEditingAttraction(null)
    alert('Attraction updated successfully!')
  } catch (error) {
    console.error('Update error:', error)
    alert('Failed to update attraction. Please try again.')
  }
}


const handleDeleteAttraction = async (attraction) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${attraction.name}"?`
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/attractions/${attraction.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete attraction')
    }

    setAttractions((currentAttractions) =>
      currentAttractions.filter(
        (item) => item.id !== attraction.id
      )
    )

    setTripPlan((currentPlan) =>
      currentPlan.filter(
        (item) => item.id !== attraction.id
      )
    )

    setEditingAttraction(null)
    alert('Attraction deleted successfully!')
  } catch (error) {
    console.error('Delete error:', error)
    alert('Failed to delete attraction. Please try again.')
  }
}
    
const handleAddAttraction = async (event) => {
  event.preventDefault()

  if (!adminToken) {
    alert('Please log in as an administrator.')
    return
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/admin/attractions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newAttraction.name.trim(),
          category: newAttraction.category,
          distance: Number(newAttraction.distance),
          description: newAttraction.description,
          latitude: Number(newAttraction.latitude),
          longitude: Number(newAttraction.longitude)
        })
      }
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to add attraction')
    }

    const attractionsResponse = await fetch(
      'http://localhost:5000/api/attractions'
    )

    if (!attractionsResponse.ok) {
      throw new Error('Attraction added, but refreshing the list failed')
    }

    const updatedAttractions = await attractionsResponse.json()
    setAttractions(updatedAttractions)

    setNewAttraction({
      name: '',
      category: 'Nature',
      distance: '',
      description: '',
      latitude: '',
      longitude: ''
    })

    setShowAddForm(false)
    alert('Attraction added successfully!')
  } catch (error) {
    console.error('Add attraction error:', error)
    alert(error.message)
  }
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


useEffect(() => {
  const sectionIds = ['home', 'attractions', 'map', 'planner', 'admin']

  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 180
    let currentSection = 'home'

    sectionIds.forEach((id) => {
      const section = document.getElementById(id)

      if (section && section.offsetTop <= scrollPosition) {
        currentSection = id
      }
    })

    setActiveSection(currentSection)
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()

  return () => {
    window.removeEventListener('scroll', updateActiveSection)
  }
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
  <span className="logo-icon">
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E9C878"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3Z" />
    </svg>
  </span>
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
  className={
    activeSection === item.href.slice(1)
      ? 'nav-active'
      : ''
  }
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
  {({
    1: "sri-dalada-maligawa-1.jpg",
    2: "dunumadalawa.jpg",
    3: "hanthana-bird-park.jpg",
    4: "ceylon-tea-museum.jpg",
    5: "sembuwatta-lake.jpg",
    6: "kalabokka-360.jpg",
    7: "hunasgiriya-waterfall.jpg",
    8: "nelligala.jpg",
    9: "embekka-dewalaya.jpg",
    10: "gadaladeniya.jpg",
  })[attraction.id] ? (
    <img
      src={`/images/attractions/${({
        1: "sri-dalada-maligawa-1.jpg",
        2: "dunumadalawa.jpg",
        3: "hanthana-bird-park.jpg",
        4: "ceylon-tea-museum.jpg",
        5: "sembuwatta-lake.jpg",
        6: "kalabokka-360.jpg",
        7: "hunasgiriya-waterfall.jpg",
        8: "nelligala.jpg",
        9: "embekka-dewalaya.jpg",
        10: "gadaladeniya.jpg",
      })[attraction.id]}`}
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

        
{selectedAttraction.id >= 1 && selectedAttraction.id <= 10 && (
  <img
    src={`/images/attractions/${({
      1: "sri-dalada-maligawa-1.jpg",
      2: "dunumadalawa.jpg",
      3: "hanthana-bird-park.jpg",
      4: "ceylon-tea-museum.jpg",
      5: "sembuwatta-lake.jpg",
      6: "kalabokka-360.jpg",
      7: "hunasgiriya-waterfall.jpg",
      8: "nelligala.jpg",
      9: "embekka-dewalaya.jpg",
      10: "gadaladeniya.jpg",
    })[selectedAttraction.id]}`}
    alt={selectedAttraction.name}
    style={{
      width: "100%",
      maxHeight: "260px",
      objectFit: "cover",
      borderRadius: "12px",
      margin: "12px 0",
    }}
  />
)}


        
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


      


<section id="planner" className="placeholder-section planner-section">
  <div className="planner-layout">

    {/* LEFT SIDE: Trip Summary */}
    <div className="planner-summary">
      <h2>Plan Your Day</h2>
      <p>Select attractions to create your one-day itinerary.</p>

      <h3>Your Selected Attractions ({tripPlan.length})</h3>

      {tripPlan.length > 0 && (
        <div className="trip-time-summary">
          <p>
            <strong>⏱️ Estimated Total Visiting Time:</strong>{' '}
            {totalVisitHours > 0 &&
              `${totalVisitHours} hour${totalVisitHours !== 1 ? 's' : ''}`}
            {totalVisitHours > 0 && remainingVisitMinutes > 0 && ' '}
            {remainingVisitMinutes > 0 &&
              `${remainingVisitMinutes} minutes`}
          </p>
          <p>
            <small>
              Note: This estimate excludes travel time, meals, and waiting.
            </small>
          </p>
        </div>
      )}
    </div>

    {/* RIGHT SIDE: Selected Attractions */}
    <div className="planner-attractions">
      <h3>Attractions</h3>

      {tripPlan.length === 0 ? (
        <p>No attractions selected yet. Add places from the attraction cards above.</p>
      ) : (
        <div className="trip-plan-list">
          {tripPlan.map((attraction, index) => (
            <div className="trip-plan-item" key={attraction.id}>
              <p>
                <strong>{index + 1}. {attraction.name}</strong>
              </p>
              <p>
                {attraction.category} · {Number(attraction.distance)} KM
              </p>
              <p>
                ⏱️ Estimated Visit: {visitDurations[attraction.id] || 60} minutes
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
    </div>

  </div>
</section>



      

<section id="admin" className="placeholder-section">
  {adminToken ? (
    <div className="admin-dashboard">
      
<div className="admin-dashboard-header">
  <div>
    <p className="admin-dashboard-label">ADMIN CONTROL PANEL</p>
    <h2>Manage Attractions</h2>
    <p>Keep Explore Kandy's attraction information up to date.</p>
  </div>
</div>

      

<button
  type="button"
  className="details-btn"
  onClick={() => setShowAddForm(!showAddForm)}
>
  {showAddForm ? 'Cancel Adding' : '+ Add New Attraction'}
</button>


{showAddForm && (
  <div className="admin-add-form">
    <h3>Add New Attraction</h3>
    
<form onSubmit={handleAddAttraction}>
  <label htmlFor="new-name">Attraction Name</label>
  <input
    id="new-name"
    type="text"
    placeholder="Enter attraction name"
    value={newAttraction.name}
    onChange={(event) =>
      setNewAttraction({
        ...newAttraction,
        name: event.target.value
      })
    }
    required
  />

  <label htmlFor="new-category">Category</label>
  <select
    id="new-category"
    value={newAttraction.category}
    onChange={(event) =>
      setNewAttraction({
        ...newAttraction,
        category: event.target.value
      })
    }
  >
    <option value="Nature">Nature</option>
    <option value="Religious">Religious</option>
    <option value="Historical">Historical</option>
  </select>

  
<label htmlFor="new-distance">Distance (KM)</label>
<input
  id="new-distance"
  type="number"
  min="0"
  max="999.9"
  step="0.1"
  placeholder="Enter distance in KM"
  value={newAttraction.distance}
  onChange={(event) =>
    setNewAttraction({
      ...newAttraction,
      distance: event.target.value
    })
  }
  required
/>

<label htmlFor="new-description">Description</label>
<textarea
  id="new-description"
  rows="4"
  placeholder="Enter attraction description"
  value={newAttraction.description}
  onChange={(event) =>
    setNewAttraction({
      ...newAttraction,
      description: event.target.value
    })
  }
/>

    
<label htmlFor="new-latitude">Latitude</label>
<input
  id="new-latitude"
  type="number"
  step="any"
  min="-90"
  max="90"
  placeholder="Example: 7.2906"
  value={newAttraction.latitude}
  onChange={(event) =>
    setNewAttraction({
      ...newAttraction,
      latitude: event.target.value
    })
  }
  required
/>

<label htmlFor="new-longitude">Longitude</label>
<input
  id="new-longitude"
  type="number"
  step="any"
  min="-180"
  max="180"
  placeholder="Example: 80.6337"
  value={newAttraction.longitude}
  onChange={(event) =>
    setNewAttraction({
      ...newAttraction,
      longitude: event.target.value
    })
  }
  required
/>

<button type="submit" className="details-btn">
  Save New Attraction
</button>


</form>

  </div>
)}


      
<div className="admin-stats">
  <h3>Total Attractions</h3>
  <p>{attractions.length}</p>
</div>

<div className="admin-attractions">
  <h3>Manage Attractions</h3>

  <div className="admin-attractions-list">
    {attractions.map((attraction) => (
      
<div className="admin-attraction-item" key={attraction.id}>
  <div>
    <h4>{attraction.name}</h4>
    <p>{attraction.category}</p>
  </div>

  
<div className="admin-attraction-actions">
  <button
    type="button"
    className="details-btn"
    onClick={() => setEditingAttraction(attraction)}
  >
    Edit
  </button>

  <button
    type="button"
    className="details-btn"
    onClick={() => handleDeleteAttraction(attraction)}
  >
    Delete
  </button>
</div>

</div>

    ))}
  </div>
</div>

      
{editingAttraction && (
  <div className="admin-edit-form">
    <h3>Edit Attraction</h3>

    <form onSubmit={handleSaveAttraction}>
      <label htmlFor="edit-name">Attraction Name</label>
      <input
        id="edit-name"
        type="text"
        value={editingAttraction.name}
        onChange={(event) =>
          setEditingAttraction({
            ...editingAttraction,
            name: event.target.value
          })
        }
      />

      <label htmlFor="edit-category">Category</label>
      <select
        id="edit-category"
        value={editingAttraction.category}
        onChange={(event) =>
          setEditingAttraction({
            ...editingAttraction,
            category: event.target.value
          })
        }
      >
        <option value="Nature">Nature</option>
        <option value="Religious">Religious</option>
        <option value="Historical">Historical</option>
      </select>

        
<label htmlFor="edit-distance">Distance (KM)</label>
<input
  id="edit-distance"
  type="number"
  min="0"
  max="999.9"
  step="0.1"
  value={editingAttraction.distance ?? ''}
  onChange={(event) =>
    setEditingAttraction({
      ...editingAttraction,
      distance: event.target.value
    })
  }
  required
/>
      
<label htmlFor="edit-description">Description</label>
<textarea
  id="edit-description"
  rows="4"
  value={editingAttraction.description ?? ''}
  onChange={(event) =>
    setEditingAttraction({
      ...editingAttraction,
      description: event.target.value
    })
  }
/>
      <button type="submit" className="details-btn">
  Save Changes
</button>

      <button type="button" onClick={() => setEditingAttraction(null)}>
        Cancel
      </button>
    </form>
  </div>
)}

      <p>✅ Login successful! Welcome, {adminUsername}.</p>

      <p>You are now signed in to Explore Kandy.</p>

      
<div className="admin-footer">
  <p>Explore Kandy Administration</p>
</div>


      <button
        className="details-btn"
        onClick={() => {
          sessionStorage.removeItem("adminToken")
          setAdminToken(null)
          setAdminPassword('')
          setLoginError('')
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <>
      <h2>Administrator Login</h2>
      <p>Sign in to manage Explore Kandy attractions.</p>

      <form
        className="admin-login-form"
        onSubmit={handleAdminLogin}
      >
        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          type="text"
          placeholder="Enter username"
          value={adminUsername}
          onChange={(event) => setAdminUsername(event.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          placeholder="Enter password"
          value={adminPassword}
          onChange={(event) => setAdminPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {loginError && <p role="alert">{loginError}</p>}

        <button type="submit" className="details-btn">
          Login
        </button>
      </form>
    </>
  )}
</section>


    </div>
  )
}

export default App

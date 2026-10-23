
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


function KandyMap({ attractions = [] }) {
  return (
    
    <MapContainer
  center={[7.3300, 80.6350]}
  zoom={10}

      style={{ height: '450px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      
{attractions
  .filter(
    (attraction) =>
      attraction.latitude !== null &&
      attraction.longitude !== null
  )
  .map((attraction) => (
    <Marker
      key={attraction.id}
      position={[
        Number(attraction.latitude),
        Number(attraction.longitude)
      ]}
    >
      <Popup>
        <strong>{attraction.name}</strong>
        <br />
        {attraction.category}
        <br />
        {Number(attraction.distance)} KM
      </Popup>
    </Marker>
  ))}

    </MapContainer>
  )
}

export default KandyMap

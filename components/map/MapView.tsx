'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Moscow metro stations coordinates (sample)
const METRO_COORDS: Record<string, [number, number]> = {
  'Выхино':        [55.727, 37.860],
  'Кузьминки':     [55.718, 37.812],
  'Люблино':       [55.676, 37.762],
  'Марьино':       [55.650, 37.745],
  'ВДНХ':          [55.822, 37.638],
  'Комсомольская': [55.775, 37.655],
  'Киевская':      [55.744, 37.566],
  'Выхино2':       [55.727, 37.860],
}

export default function MapView() {
  return (
    <div style={{ height: 220, width: '100%' }}>
      <MapContainer
        center={[55.751, 37.618]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />
        {Object.entries(METRO_COORDS).map(([name, coords]) => (
          <Marker key={name} position={coords} icon={icon}>
            <Popup>🚇 {name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

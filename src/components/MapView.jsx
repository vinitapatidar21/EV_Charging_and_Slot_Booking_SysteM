import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import './MapView.css';


const mockStations = [
  {
    id: 1,
    name: 'Mumbai Central EV Station',
    location: [72.8311, 18.9389], // Updated to random location near Mumbai
    address: 'Colaba, Mumbai, MH 400001',
    chargers: [{ type: 'Level 3 DC Fast', power: '50 kW', available: 3 }, { type: 'Level 2 AC', power: '22 kW', available: 5 }]
  },
  {
    id: 2,
    name: 'Delhi EV Charging Hub',
    location: [77.2315, 28.6129], // Updated to random location near Delhi
    address: 'Hauz Khas, New Delhi, DL 110016',
    chargers: [{ type: 'Level 3 DC Fast', power: '100 kW', available: 2 }]
  },
  {
    id: 3,
    name: 'Bengaluru Tech Park Station',
    location: [77.6423, 12.9342], // Updated to random location near Bengaluru
    address: 'Electronic City, Bengaluru, KA 560100',
    chargers: [{ type: 'Level 2 AC', power: '11 kW', available: 6 }]
  },
  {
    id: 4,
    name: 'Hyderabad Green Charge',
    location: [78.3676, 17.4483], // Updated to random location near Hyderabad
    address: 'Gachibowli, Hyderabad, TS 500032',
    chargers: [{ type: 'Level 3 DC Fast', power: '150 kW', available: 1 }, { type: 'Level 2 AC', power: '22 kW', available: 4 }]
  },
  {
    id: 5,
    name: 'Chennai EV Bay',
    location: [80.2419, 13.0396], // Updated to random location near Chennai
    address: 'Adyar, Chennai, TN 600020',
    chargers: [{ type: 'Level 2 AC', power: '7.4 kW', available: 7 }]
  },
  {
    id: 6,
    name: 'Pune EV Point',
    location: [73.8567, 18.5204], // New station near Pune
    address: 'Koregaon Park, Pune, MH 411001',
    chargers: [{ type: 'Level 2 AC', power: '22 kW', available: 4 }]
  },
  {
    id: 7,
    name: 'Jaipur Solar Charge',
    location: [75.7873, 26.9124], // New station near Jaipur
    address: 'Malviya Nagar, Jaipur, RJ 302017',
    chargers: [{ type: 'Level 3 DC Fast', power: '50 kW', available: 2 }]
  }
];

const MapView = ({ height = '500px', onStationSelect, interactive = true }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [userLocation, setUserLocation] = useState([77.1025, 28.7041]); // Default to Delhi
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      (error) => {
        console.warn('Geolocation not available or permission denied. Using default.');
      }
    );
  }, []);

  useEffect(() => {
    if (map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=NO8PSA9JDnAcuVFYqKHO',
        center: userLocation,
        zoom: 11,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Clear any existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Add user location marker
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }
        
        const userMarkerEl = document.createElement('div');
        userMarkerEl.className = 'user-marker';
        userMarkerEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `;
        
        userMarkerRef.current = new maplibregl.Marker(userMarkerEl)
          .setLngLat(userLocation)
          .setPopup(new maplibregl.Popup().setHTML('<div class="text-sm font-semibold">Your Location</div>'))
          .addTo(map.current);

        // Add charging station markers
        mockStations.forEach(station => {
          const el = document.createElement('div');
          el.className = 'station-marker';
          el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#10b981" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8v3a3 3 0 0 1-3 3H9"/>
              <path d="m15 11-3-3 3-3"/>
              <rect x="6" y="9" width="6" height="6" rx="2"/>
            </svg>
          `;

          const marker = new maplibregl.Marker(el)
            .setLngLat(station.location)
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div class="text-sm">
                  <h3 class="font-bold text-ev-blue">${station.name}</h3>
                  <p class="text-gray-600 text-xs">${station.address}</p>
                  <div class="mt-2">
                    <p class="font-semibold text-xs">Available Chargers:</p>
                    ${station.chargers.map(charger =>
                      `<p class="text-xs">${charger.type} (${charger.power}) - ${charger.available} available</p>`
                    ).join('')}
                  </div>
                  <button id="book-station-${station.id}" class="mt-2 bg-ev-blue text-white text-xs py-1 px-2 rounded">Book Now</button>
                </div>
              `)
            )
            .addTo(map.current);

          marker.getElement().addEventListener('click', () => {
            if (onStationSelect) {
              onStationSelect(station);
            }
          });

          markersRef.current.push(marker);
        });
      });

      map.current.on('error', (e) => {
        setMapError('Failed to load map. Please check your internet connection.');
        console.error('Map error:', e.error);
      });

    } catch (error) {
      setMapError('Failed to initialize map.');
      console.error('Map initialization error:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    };
  }, [userLocation, onStationSelect]);

  return (
    <div className="relative" style={{ height }}>
      {mapError ? (
        <div className="h-full flex items-center justify-center bg-gray-100 text-red-500">
          {mapError}
        </div>
      ) : (
        <div
          ref={mapContainer}
          className="w-full h-full rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default MapView;
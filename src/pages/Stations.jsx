
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooking } from '@/contexts/BookingContext';
import { Search } from 'lucide-react';

const Stations = () => {
  const { stations } = useBooking();
  const [filteredStations, setFilteredStations] = useState(stations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // Update filtered stations when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStations(stations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = stations.filter(station => 
        station.name.toLowerCase().includes(query) || 
        station.address.toLowerCase().includes(query)
      );
      setFilteredStations(filtered);
    }
  }, [searchQuery, stations]);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    
    // Find the station in the list and scroll to it
    const stationElement = document.getElementById(`station-${station.id}`);
    if (stationElement) {
      stationElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Charging Stations</h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by station name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map View */}
          <div className="md:w-1/2">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Map</h2>
              <div className="rounded-lg overflow-hidden">
                <MapView height="600px" onStationSelect={handleStationSelect} />
              </div>
            </div>
          </div>
          
          {/* Station List */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Available Stations ({filteredStations.length})</h2>
            
            {filteredStations.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-600">No stations matching your search.</p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-ev-blue mt-2 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    id={`station-${station.id}`}
                    className={`bg-white rounded-lg p-5 shadow-sm border transition-all ${
                      selectedStation?.id === station.id ? 'border-ev-blue ring-2 ring-ev-lightblue' : 'border-transparent hover:shadow-md'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-ev-blue">{station.name}</h3>
                    <p className="text-gray-600 mb-3">{station.address}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Available Chargers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {station.chargers.map((charger, idx) => (
                          <div key={idx} className="bg-ev-lightblue px-3 py-1 rounded-full text-xs">
                            {charger.type} ({charger.power}) - <span className="font-medium">{charger.available} available</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Link to={`/book/${station.id}`}>
                        <Button className="bg-ev-blue hover:bg-blue-600 text-white">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stations;

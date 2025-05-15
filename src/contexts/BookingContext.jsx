
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

// Mock data for charging stations
// Updated mock data with random locations around India
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

// Generate available time slots for a given day
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 7;
  const endHour = 22;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      slots.push({ time, isAvailable });
    }
  }
  
  return slots;
};

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [stations, setStations] = useState(mockStations);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedBookings = localStorage.getItem(`bookings-${currentUser.id}`);
      if (savedBookings) {
        try {
          setBookings(JSON.parse(savedBookings));
        } catch (error) {
          console.error('Failed to parse bookings', error);
        }
      }
    }
    setLoading(false);
  }, [currentUser]);

  // Save bookings to localStorage when they change
  useEffect(() => {
    if (currentUser && bookings.length > 0) {
      localStorage.setItem(`bookings-${currentUser.id}`, JSON.stringify(bookings));
    }
  }, [bookings, currentUser]);

  const getStation = (stationId) => {
    const id = parseInt(stationId, 10);
    return stations.find(station => station.id === id) || null;
  };

  // Calculate price based on demand and time of day
  const calculatePrice = (date, time, stationId, chargerType) => {
    // Base price depending on charger type
    let basePrice = 10; // Default price for Level 2 AC
    if (chargerType.includes('Level 3') || chargerType.includes('Fast')) {
      basePrice = 15;
    }
    
    // Time factor - peak hours cost more (8-10am and 5-8pm)
    const hour = parseInt(time.split(':')[0], 10);
    let timeFactor = 1.0;
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      timeFactor = 1.5; // 50% more during peak hours
    }
    
    // Demand factor - simulate higher demand on certain stations
    let demandFactor = 1.0;
    const stationIdNum = parseInt(stationId, 10);
    
    // Use the seed to generate pseudo-random but consistent demand
    const dateObj = new Date(date);
    const seed = stationIdNum + dateObj.getDate() + dateObj.getMonth();
    const hash = (seed * hour) % 100;
    
    // Higher demand based on hash
    if (hash > 80) {
      demandFactor = 1.8; // Very high demand - 80% surcharge
    } else if (hash > 60) {
      demandFactor = 1.5; // High demand - 50% surcharge
    } else if (hash > 40) {
      demandFactor = 1.2; // Moderate demand - 20% surcharge
    }
    
    // Calculate final price and round to 2 decimal places
    const price = (basePrice * timeFactor * demandFactor).toFixed(2);
    
    return {
      basePrice,
      timeFactor,
      demandFactor,
      finalPrice: price
    };
  };

  // Get available time slots for a station on a specific date
  const getAvailableSlots = (stationId, date) => {
    console.log(`Getting slots for station ${stationId} on ${date}`);
    
    // Generate pseudo-random but consistent slots based on stationId and date
    const dateObj = new Date(date);
    const seed = stationId + dateObj.getDate() + dateObj.getMonth();
    
    // Use the seed to get somewhat consistent but varied availability
    const slots = generateTimeSlots().map(slot => {
      const hash = (slot.time.charCodeAt(0) * seed) % 100;
      return {
        ...slot,
        isAvailable: hash > 30 // 70% chance of being available
      };
    });
    
    return slots;
  };

  // Book a slot
  const bookSlot = async (stationId, date, time, chargerType, paymentInfo) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to book a slot');
      }
      
      setLoading(true);
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const station = getStation(stationId);
      if (!station) {
        throw new Error('Station not found');
      }
      
      // Calculate price based on demand
      const pricing = calculatePrice(date, time, stationId, chargerType);
      
      // Simulate payment processing
      if (!paymentInfo) {
        throw new Error('Payment information is required');
      }
      
      // Create booking with payment details
      const newBooking = {
        id: `booking-${Date.now()}`,
        userId: currentUser.id,
        stationId: parseInt(stationId, 10),
        stationName: station.name,
        stationAddress: station.address,
        date,
        time,
        chargerType,
        price: pricing.finalPrice,
        status: 'confirmed',
        paymentMethod: `${paymentInfo.cardType} **** ${paymentInfo.cardLast4}`,
        createdAt: new Date().toISOString()
      };
      
      setBookings(prev => [...prev, newBooking]);
      
      toast({
        title: "Payment Successful!",
        description: `Your booking at ${station.name} is confirmed for ${date} at ${time}. Total paid: $${pricing.finalPrice}`,
        variant: "default",
      });
      
      return newBooking;
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book the slot. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);
      
      toast({
        title: "Booking Cancelled",
        description: `Your booking at ${booking.stationName} for ${booking.date} has been cancelled.`,
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel the booking.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserBookings = () => {
    if (!currentUser) return [];
    return bookings.filter(booking => booking.userId === currentUser.id);
  };

  const value = {
    stations,
    bookings: getUserBookings(),
    loading,
    getStation,
    getAvailableSlots,
    bookSlot,
    cancelBooking,
    calculatePrice
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use the booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};


import React, { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check } from 'lucide-react';

const Bookings = () => {
  const { bookings, cancelBooking, loading } = useBooking();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedBookingId) {
      await cancelBooking(selectedBookingId);
    }
    setCancelDialogOpen(false);
  };

  // Group bookings by date
  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {});

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedBookings).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if a booking is in the past
  const isPastBooking = (dateString, timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const bookingDate = new Date(dateString);
    bookingDate.setHours(hours, minutes);
    return bookingDate < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="bg-ev-lightgreen h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-ev-green h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't booked any charging slots yet. Start by finding a station near you.
            </p>
            <Link to="/stations">
              <Button className="bg-ev-blue hover:bg-blue-600">
                Find Charging Stations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date} className="bg-white rounded-lg shadow-md">
                <div className="bg-ev-blue text-white px-6 py-3 rounded-t-lg">
                  <h2 className="font-semibold">{formatDate(date)}</h2>
                </div>
                <div className="divide-y">
                  {groupedBookings[date].map(booking => {
                    const isPast = isPastBooking(booking.date, booking.time);
                    return (
                      <div key={booking.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-ev-dark">
                              {booking.stationName}
                            </h3>
                            <p className="text-gray-600 text-sm">{booking.stationAddress}</p>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="font-medium text-ev-blue">{booking.time}</p>
                            <p className="text-sm text-gray-600">{booking.chargerType}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className={`px-3 py-1 rounded-full text-xs ${
                            isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                          }`}>
                            {isPast ? 'Completed' : 'Upcoming'}
                          </div>
                          
                          {!isPast && (
                            <Button
                              variant="outline"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelClick(booking.id)}
                              disabled={loading}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Cancel Booking Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600"
                onClick={confirmCancel}
              >
                Yes, Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Bookings;

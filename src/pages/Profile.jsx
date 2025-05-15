
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const saveProfile = () => {
    // In a real app, this would call an API endpoint
    // For now, just toggle editing state
    setIsEditing(false);
  };
  
  // Get upcoming and past bookings
  const upcomingBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    return bookingDateTime > new Date();
  });
  
  const pastBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    return bookingDateTime <= new Date();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-ev-lightblue text-ev-blue flex items-center justify-center text-3xl font-bold mb-4">
                  {currentUser.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-center">{currentUser.name}</h2>
                <p className="text-gray-600 text-sm">{currentUser.email}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-200 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-ev-blue hover:bg-blue-600"
                      onClick={saveProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-600">Full Name</h3>
                      <p className="font-medium">{currentUser.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-600">Email</h3>
                      <p className="font-medium">{currentUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-600">Member Since</h3>
                      <p className="font-medium">
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-ev-lightblue p-4 rounded-lg">
                      <div className="text-3xl font-bold text-ev-blue">{upcomingBookings.length}</div>
                      <div className="text-sm text-gray-600">Upcoming Bookings</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-gray-700">{pastBookings.length}</div>
                      <div className="text-sm text-gray-600">Past Bookings</div>
                    </div>
                  </div>
                  
                  <Link to="/bookings">
                    <Button className="w-full bg-ev-blue hover:bg-blue-600">
                      View All Bookings
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

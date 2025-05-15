
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Check, Menu } from 'lucide-react';
//import icon from '../../public/uploads/Picture12.png';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 shadow-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className=" bg-white text-white">
            <Check />
            {/* <img src={icon} className='w-[60px]'/> */}
          </div>
          <span className="text-xl font-semibold text-ev-dark">ChargeUp</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-ev-blue transition-colors">
            Home
          </Link>
          <Link to="/stations" className="text-gray-600 hover:text-ev-blue transition-colors">
            Stations
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/bookings" className="text-gray-600 hover:text-ev-blue transition-colors">
                My Bookings
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-ev-blue transition-colors">
                Profile
              </Link>
              <Button variant="ghost" onClick={onLogout} className="text-gray-600">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-ev-blue hover:bg-ev-lightblue">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-ev-blue hover:bg-blue-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="bg-ev-green rounded-full p-1 text-white">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-xl font-semibold text-ev-dark">ChargeUp</span>
              </Link>
              <button
                className="text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <Link
                to="/"
                className="text-lg text-gray-600 hover:text-ev-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/stations"
                className="text-lg text-gray-600 hover:text-ev-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Stations
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/bookings"
                    className="text-lg text-gray-600 hover:text-ev-blue transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="text-lg text-gray-600 hover:text-ev-blue transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-lg text-gray-600 hover:text-ev-blue transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-lg text-ev-blue"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-lg bg-ev-blue text-white py-2 px-4 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

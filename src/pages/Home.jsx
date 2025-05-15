
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MapView from '@/components/MapView';
import { useAuth } from '@/contexts/AuthContext';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import banner from '../../public/uploads/Picture1.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-50/50 py-14 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-ev-navy mb-4">
                Find Your Nearest Charging Station in Seconds
              </h1>
              <p className="text-gray-600 mb-8">
                Use the ChargeSync EV Station Finder to easily find charging stations near you and book your slot in advance.
              </p>
              <Link to="/stations">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Search Now
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={banner} 
                alt="EV Charging"
                className="rounded-lg mx-auto"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-100 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-ev-navy mb-1">500+</h3>
              <p className="text-gray-600">Stations Nationwide</p>
            </div>
            <div className="bg-green-100 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-ev-navy mb-1">10k+</h3>
              <p className="text-gray-600">Vehicles Charged</p>
            </div>
            <div className="bg-green-100 rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold text-ev-navy mb-1">15k+</h3>
              <p className="text-gray-600">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-ev-navy mb-2">How It Works</h2>
          <p className="text-center text-gray-600 mb-10">EV Station finder is simple to charge your electric vehicle with our easy-to-use interface.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-yellow-100 rounded-lg p-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Search</h3>
              <p className="text-gray-600">Find the nearest EV charging station with our map-based search.</p>
            </div>
            <div className="bg-green-100 rounded-lg p-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Check Rates</h3>
              <p className="text-gray-600">Compare prices for each station and find the best deal.</p>
            </div>
            <div className="bg-red-100 rounded-lg p-6">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Reserve</h3>
              <p className="text-gray-600">Book a slot in advance to guarantee availability when you arrive.</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-3">Charge</h3>
              <p className="text-gray-600">Plug in your vehicle at your reserved time and charge up!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Stations */}
      <section className="py-14 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-ev-navy mb-2">Popular Charging Stations Near You</h2>
          <p className="text-center text-gray-600 mb-10">Explore the most frequently used charging stations in your area.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200">
                  <img 
                    src={`/placeholder.svg`}
                    alt="Station" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{index === 1 ? 'Ampay Charging Station' : index === 2 ? 'Speedy Charging Station' : index === 3 ? 'Accelero Charging Station' : 'ChargePulse Station'}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="ml-1 text-sm">4.{index + 4}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">123 Electric Avenue, City</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>3 miles away</span>
                    <span>${Math.round(Math.random() * 10 + 10)}/hr</span>
                  </div>
                  <Link to="/stations">
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 px-4 md:px-6 lg:px-8 bg-ev-navy text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Charging Network?</h2>
              
              <div className="bg-orange-500 p-6 rounded-lg mb-6">
                <h3 className="text-2xl font-bold mb-2">100%</h3>
                <p className="font-semibold mb-1">Reliable Network</p>
                <p className="text-sm opacity-90">Our stations are regularly maintained to ensure maximum uptime</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                <p className="opacity-90">No hidden fees or charges - pay only for what you use</p>
              </div>
            </div>
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Charging Station" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-14 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-ev-navy mb-6">Revolutionize the Way You Charge</h2>
              <p className="text-gray-600 mb-6">
                Download ChargeSync's EV Station Finder App today and never worry about finding a charging station again. Easy booking, convenient payment options, and real-time availability updates all in one place.
              </p>
              <div className="flex space-x-4 mb-4">
                <Button variant="outline" size="lg" className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.707 10.708L16.293 9.294l-3.293 3.292-2.293-2.292-1.414 1.414 3.707 3.707 4.707-4.707zM21 20V7l-9-4-7 3v1h8v13h8zM3 5v15h8V5H3z"/></svg>
                  Download App
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="App Map" 
                  className="w-full"
                />
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-lg font-bold text-ev-navy">1.8k+</span>
                  <p className="text-sm text-gray-600">Charging Stations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 md:px-6 lg:px-8 bg-green-50/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-ev-navy mb-10">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
              </div>
              <p className="mb-6 text-gray-600">
                "This app has made my experience booking a charging station so much easier! I can always find available spots and the booking process is seamless."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <p className="font-semibold">Jamie Wilson</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400" />
              </div>
              <p className="mb-6 text-gray-600">
                "What a great app! Finding charging stations near me has never been easier. The real-time availability feature is a game changer for EV owners."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <p className="font-semibold">Rebecca G.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button className="w-8 h-8 rounded-full border flex items-center justify-center mr-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full border flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-ev-navy mb-10">Answer to your questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What is EV Station?</AccordionTrigger>
                  <AccordionContent>
                    EV Station is a platform that helps electric vehicle owners find and book charging stations near them.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How do I find a charging station near me?</AccordionTrigger>
                  <AccordionContent>
                    Simply use our map-based search to find stations near your location or enter an address to find stations in that area.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Are the charging stations listed on EV Station service for any customer?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all stations listed on our platform are available for public use, regardless of the electric vehicle brand you own.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">How can I update or cancel a reservation?</AccordionTrigger>
                  <AccordionContent>
                    Log in to your account, go to "My Reservations," and select the booking you wish to modify or cancel.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Is there a fee to use EV Station?</AccordionTrigger>
                  <AccordionContent>
                    Our basic service is free to use. You only pay for the charging session at the rates displayed for each station.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">How can I contact EV Station for support or feedback?</AccordionTrigger>
                  <AccordionContent>
                    You can reach our support team through the "Contact" page or by emailing support@evstation.com.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-white text-lg font-semibold mb-2">ChargeUp</h2>
              <p className="text-gray-400 text-sm">The easiest way to charge your EV</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-white font-medium mb-2">Company</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Resources</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li><a href="#" className="hover:text-white">Support</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-white font-medium mb-2">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-700" />
          <p className="text-center text-gray-400 text-sm">
            &copy; 2025 ChargeUp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

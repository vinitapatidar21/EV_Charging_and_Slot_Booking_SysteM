import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CreditCard, Clock, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const BookingPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { getStation, getAvailableSlots, bookSlot, loading, calculatePrice } = useBooking();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [station, setStation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const form = useForm({
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: ""
    }
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book a charging slot",
        variant: "default",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Get station details
  useEffect(() => {
    const stationData = getStation(stationId);
    if (stationData) {
      setStation(stationData);
      // Set the first charger type as default
      if (stationData.chargers && stationData.chargers.length > 0) {
        setSelectedCharger(stationData.chargers[0].type);
      }
    } else {
      // Station not found
      navigate('/stations');
    }
  }, [stationId, getStation, navigate]);
  
  // Get available slots when date or station changes
  useEffect(() => {
    if (station && date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const slots = getAvailableSlots(station.id, formattedDate);
      setAvailableSlots(slots);
      setSelectedTime(null); // Reset selected time when date changes
      
      // Reset pricing information when date changes
      setPricing(null);
    }
  }, [station, date, getAvailableSlots]);
  
  // Calculate pricing when selection changes
  useEffect(() => {
    if (station && date && selectedTime && selectedCharger) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const priceInfo = calculatePrice(formattedDate, selectedTime, station.id, selectedCharger);
      setPricing(priceInfo);
    }
  }, [station, date, selectedTime, selectedCharger, calculatePrice]);
  
  const handleProceedToPayment = () => {
    if (!selectedTime || !selectedCharger) {
      toast({
        title: "Selection Required",
        description: "Please select a time slot and charger type",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };
  
  const handlePaymentSubmit = async (data) => {
    try {
      setProcessingPayment(true);
      
      // Simulate payment processing
      const cardType = getCardType(data.cardNumber);
      const cardLast4 = data.cardNumber.slice(-4);
      
      const paymentInfo = {
        cardType,
        cardLast4,
        cardName: data.cardName
      };
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      await bookSlot(station.id, formattedDate, selectedTime, selectedCharger, paymentInfo);
      navigate('/bookings');
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Helper function to determine card type from number
  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'MasterCard';
    if (firstDigit === '3') return 'Amex';
    if (firstDigit === '6') return 'Discover';
    return 'Card';
  };
  
  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow mb-4">
            <div className="h-8 w-48 bg-gray-300 rounded-md mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading station details...</p>
        </div>
      </div>
    );
  }
  
  const deriveColorFromDemandFactor = (factor) => {
    if (!factor) return 'bg-gray-100';
    if (factor >= 1.5) return 'bg-red-100 text-red-800';
    if (factor >= 1.2) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-1 text-ev-blue">{station.name}</h1>
          <p className="text-gray-600 mb-6">{station.address}</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Date Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Date</h2>
              <div className="border rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => day && setDate(day)}
                  className="mx-auto"
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Select Charger Type</h2>
                <div className="flex flex-wrap gap-3">
                  {station.chargers.map((charger, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                        selectedCharger === charger.type 
                          ? 'bg-ev-blue text-white border-ev-blue' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-ev-blue'
                      }`}
                      onClick={() => setSelectedCharger(charger.type)}
                    >
                      {charger.type} ({charger.power}) - {charger.available} available
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Time Slots */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Time</h2>
              
              <div className="text-sm mb-4">
                <span className="font-medium">Selected Date: </span>
                <span className="text-gray-700">{format(date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    className={`py-2 px-3 rounded-md text-sm transition-colors ${
                      selectedTime === slot.time
                        ? 'bg-ev-blue text-white'
                        : slot.isAvailable 
                          ? 'bg-ev-lightblue text-ev-blue hover:bg-blue-100' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                    disabled={!slot.isAvailable}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Station:</span>
                      <span className="font-medium">{station.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{format(date, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charger Type:</span>
                      <span className="font-medium">{selectedCharger || 'Not selected'}</span>
                    </div>
                    
                    {pricing && (
                      <>
                        <div className="pt-2 border-t border-gray-200 mt-2"></div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-medium">${pricing.basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Time Factor:</span>
                          <div className={`px-2 py-1 rounded text-xs ${
                            pricing.timeFactor > 1 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {pricing.timeFactor > 1 ? 'Peak Hours' : 'Off-Peak'} ({pricing.timeFactor}x)
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Demand:</span>
                          <div className={`px-2 py-1 rounded text-xs ${deriveColorFromDemandFactor(pricing.demandFactor)}`}>
                            {pricing.demandFactor >= 1.5 ? 'High' : pricing.demandFactor >= 1.2 ? 'Medium' : 'Low'} ({pricing.demandFactor}x)
                          </div>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-2">
                          <span>Total Price:</span>
                          <span className="text-ev-blue">${pricing.finalPrice}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <Button
                  className="w-full bg-ev-blue hover:bg-blue-600"
                  disabled={!selectedTime || !selectedCharger || loading}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Sheet */}
      <Sheet open={showPayment} onOpenChange={setShowPayment}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
            <SheetDescription>
              Enter your card information to complete booking
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 py-6">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              {/* ... your booking summary ... */}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name on Card</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" required {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="4111 1111 1111 1111" 
                        maxLength={16} 
                        required 
                        {...field}
                        onChange={(e) => {
                          // Keep only digits
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          maxLength={5} 
                          required 
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 2) {
                              value = `${value.slice(0, 2)}/${value.slice(2)}`;
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardCvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          maxLength={3} 
                          required 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ev-blue hover:bg-blue-600 mt-4"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> 
                      Pay ${pricing ? pricing.finalPrice : '0.00'}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookingPage;

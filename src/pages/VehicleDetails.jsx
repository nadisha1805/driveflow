import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Fuel, Settings, CheckCircle2, XCircle, ArrowLeft, Calendar } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { differenceInDays, addDays, startOfDay, parseISO } from 'date-fns';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const { vehicles: mockVehicles } = useVehicle();
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkAvailability } = useBooking();
  const { isAuthenticated } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  
  // Booking form state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');
  
  // Availability state
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null, 'available', 'unavailable'
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === id);
    if (found) setVehicle(found);
    // In a real app, handle 404 here
  }, [id]);

  // Reset availability status when dates change
  useEffect(() => {
    setAvailabilityStatus(null);
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = pickupDate ? pickupDate : today;

  if (!vehicle) return <div className="loader-page"><div className="loader"></div></div>;

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    if (!pickupDate || !returnDate) return;

    setIsChecking(true);
    
    // Create combined datetime strings
    const pickupDateTime = `${pickupDate}T${pickupTime}:00`;
    const returnDateTime = `${returnDate}T${returnTime}:00`;

    // Simulate slight network delay for realism
    setTimeout(() => {
      const isAvailable = checkAvailability(vehicle.id, pickupDateTime, returnDateTime);
      setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
      setIsChecking(false);
    }, 600);
  };

  const handleContinueBooking = () => {
    if (!isAuthenticated) {
      // Redirect to login, but ideally pass state so they come back to the booking flow
      navigate('/login', { state: { from: `/booking/${vehicle.id}`, bookingData: { pickupDate, pickupTime, returnDate, returnTime } } });
      return;
    }
    
    // Store selected dates in session storage to pass to the booking flow page
    sessionStorage.setItem('pending_booking', JSON.stringify({
      vehicleId: vehicle.id,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime
    }));
    
    navigate(`/booking/${vehicle.id}`);
  };

  return (
    <div className="page-container container">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Fleet
      </Link>
      
      <div className="vehicle-details-grid">
        {/* Left Column: Details */}
        <div>
          <div className="vehicle-gallery">
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-main-image" />
          </div>
          
          <div className="vehicle-info">
            <div className="vehicle-header-flex">
              <div>
                <div className="badge badge-neutral mb-2">{vehicle.category}</div>
                <h1 className="heading-lg">{vehicle.name}</h1>
              </div>
              <div className="vehicle-price-large">
                ${vehicle.pricePerDay}<span className="text-sm text-muted font-normal">/day</span>
              </div>
            </div>
            
            <div className="spec-grid">
              <div className="spec-box">
                <Settings className="spec-box-icon" size={24} />
                <span className="spec-box-label">{vehicle.transmission}</span>
              </div>
              <div className="spec-box">
                <Users className="spec-box-icon" size={24} />
                <span className="spec-box-label">{vehicle.seats} Seats</span>
              </div>
              <div className="spec-box">
                <Fuel className="spec-box-icon" size={24} />
                <span className="spec-box-label">{vehicle.fuelType}</span>
              </div>
              <div className="spec-box">
                <CarIcon className="spec-box-icon" size={24} />
                <span className="spec-box-label">{vehicle.category}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="heading-md mb-4">Description</h3>
              <p className="text-muted" style={{ lineHeight: 1.6 }}>{vehicle.description}</p>
            </div>
            
            <div>
              <h3 className="heading-md mb-4">Features</h3>
              <div className="features-list">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <CheckCircle2 size={18} className="text-accent-color" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Booking Widget */}
        <div>
          <div className="booking-widget">
            <h3 className="heading-sm mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-primary-color" />
              Check Availability
            </h3>
            
            <form onSubmit={handleCheckAvailability}>
              <div className="form-group">
                <label className="form-label">Pickup Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required 
                  min={today}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (returnDate && e.target.value > returnDate) {
                      setReturnDate(e.target.value);
                    }
                  }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Pickup Time</label>
                <input 
                  type="time" 
                  className="form-input" 
                  required 
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>
              
              <div className="form-group mt-6">
                <label className="form-label">Return Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required 
                  min={minReturnDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Return Time</label>
                <input 
                  type="time" 
                  className="form-input" 
                  required 
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                />
              </div>
              
              <div className="mt-8">
                {availabilityStatus === 'available' && (
                  <div className="availability-alert success">
                    <CheckCircle2 size={20} />
                    Vehicle is available for these dates!
                  </div>
                )}
                
                {availabilityStatus === 'unavailable' && (
                  <div className="availability-alert error">
                    <XCircle size={20} />
                    Vehicle is already booked for these dates. Try different dates.
                  </div>
                )}
                
                {availabilityStatus === 'available' ? (
                  <button type="button" className="btn btn-primary w-full" onClick={handleContinueBooking}>
                    Continue to Booking
                  </button>
                ) : (
                  <button type="submit" className="btn btn-accent w-full" disabled={isChecking || !pickupDate || !returnDate}>
                    {isChecking ? 'Checking...' : 'Check Availability'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Car as CarIcon } from 'lucide-react';

export default VehicleDetails;

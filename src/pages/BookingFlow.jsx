import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useVehicle } from '../context/VehicleContext';
import { differenceInDays, parseISO, startOfDay, isBefore } from 'date-fns';
import './BookingFlow.css';

const STEPS = {
  DATES: 1,
  DETAILS: 2,
  REVIEW: 3,
  CONFIRMATION: 4
};

const BookingFlow = () => {
  const { vehicles: mockVehicles } = useVehicle();
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkAvailability, createBooking } = useBooking();
  
  const [vehicle, setVehicle] = useState(null);
  const [currentStep, setCurrentStep] = useState(STEPS.DATES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form State
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    driverName: user?.name || '',
    driverEmail: user?.email || '',
    driverPhone: user?.phone || '',
    driverLicense: '',
    specialRequests: ''
  });

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === vehicleId);
    if (!found) {
      navigate('/vehicles');
      return;
    }
    setVehicle(found);

    // Check if dates were passed from vehicle details page
    const pendingBooking = sessionStorage.getItem('pending_booking');
    if (pendingBooking) {
      try {
        const data = JSON.parse(pendingBooking);
        if (data.vehicleId === vehicleId) {
          setBookingData(prev => ({
            ...prev,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
            returnDate: data.returnDate,
            returnTime: data.returnTime
          }));
          // Auto advance to details if dates are complete
          if (data.pickupDate && data.returnDate) {
            setCurrentStep(STEPS.DETAILS);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [vehicleId, navigate]);

  if (!vehicle) return <div className="loader-page"><div className="loader"></div></div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;
    
    // Simplistic days calculation for UI
    const start = parseISO(bookingData.pickupDate);
    const end = parseISO(bookingData.returnDate);
    let days = differenceInDays(end, start);
    if (days < 1) days = 1; // Minimum 1 day charge
    
    return days * vehicle.pricePerDay;
  };

  const validateDatesStep = () => {
    setError('');
    if (!bookingData.pickupDate || !bookingData.returnDate) {
      setError('Please select both pickup and return dates.');
      return false;
    }
    
    const pickupDateTime = `${bookingData.pickupDate}T${bookingData.pickupTime}:00`;
    const returnDateTime = `${bookingData.returnDate}T${bookingData.returnTime}:00`;
    
    const isAvailable = checkAvailability(vehicle.id, pickupDateTime, returnDateTime);
    if (!isAvailable) {
      setError('Vehicle is not available for these dates. Please select different dates.');
      return false;
    }
    
    return true;
  };

  const validateDetailsStep = () => {
    setError('');
    if (!bookingData.driverName || !bookingData.driverEmail || !bookingData.driverPhone || !bookingData.driverLicense) {
      setError('Please fill in all required driver details.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === STEPS.DATES && !validateDatesStep()) return;
    if (currentStep === STEPS.DETAILS && !validateDetailsStep()) return;
    
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const submitBooking = async () => {
    setError('');
    setIsSubmitting(true);
    
    try {
      const pickupDateTime = `${bookingData.pickupDate}T${bookingData.pickupTime}:00`;
      const returnDateTime = `${bookingData.returnDate}T${bookingData.returnTime}:00`;
      
      const newBooking = await createBooking({
        vehicleId: vehicle.id,
        userId: user.id,
        pickupDate: pickupDateTime,
        returnDate: returnDateTime,
        totalAmount: calculateTotal(),
        customerDetails: {
          name: bookingData.driverName,
          email: bookingData.driverEmail,
          phone: bookingData.driverPhone,
          license: bookingData.driverLicense,
          requests: bookingData.specialRequests
        }
      });
      
      setConfirmedBooking(newBooking);
      sessionStorage.removeItem('pending_booking');
      setCurrentStep(STEPS.CONFIRMATION);
    } catch (err) {
      setError(err.message || 'An error occurred while creating your booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="booking-steps">
      <div className={`step-indicator ${currentStep >= STEPS.DATES ? 'active' : ''} ${currentStep > STEPS.DATES ? 'completed' : ''}`}>
        <div className="step-circle">{currentStep > STEPS.DATES ? <Check size={16} /> : 1}</div>
        <span className="step-label">Dates & Time</span>
      </div>
      <div className={`step-indicator ${currentStep >= STEPS.DETAILS ? 'active' : ''} ${currentStep > STEPS.DETAILS ? 'completed' : ''}`}>
        <div className="step-circle">{currentStep > STEPS.DETAILS ? <Check size={16} /> : 2}</div>
        <span className="step-label">Driver Details</span>
      </div>
      <div className={`step-indicator ${currentStep >= STEPS.REVIEW ? 'active' : ''} ${currentStep > STEPS.REVIEW ? 'completed' : ''}`}>
        <div className="step-circle">{currentStep > STEPS.REVIEW ? <Check size={16} /> : 3}</div>
        <span className="step-label">Review</span>
      </div>
      <div className={`step-indicator ${currentStep >= STEPS.CONFIRMATION ? 'active' : ''}`}>
        <div className="step-circle">{currentStep >= STEPS.CONFIRMATION ? <Check size={16} /> : 4}</div>
        <span className="step-label">Confirmation</span>
      </div>
    </div>
  );

  return (
    <div className="page-container container">
      <div className="booking-flow-container">
        
        {currentStep < STEPS.CONFIRMATION && (
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Complete Your Booking</h1>
            <p className="text-muted">You are booking the {vehicle.name}</p>
          </div>
        )}

        <StepIndicator />

        {error && (
          <div className="alert alert-error mb-6 flex items-start gap-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <div className="booking-card">
          {/* STEP 1: DATES */}
          {currentStep === STEPS.DATES && (
            <div>
              <h2 className="heading-md mb-6">Select Dates & Times</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="heading-sm mb-4">Pickup</h3>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input 
                      type="date" 
                      name="pickupDate"
                      className="form-input" 
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.pickupDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input 
                      type="time" 
                      name="pickupTime"
                      className="form-input" 
                      value={bookingData.pickupTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="heading-sm mb-4">Return</h3>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input 
                      type="date" 
                      name="returnDate"
                      className="form-input" 
                      min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                      value={bookingData.returnDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input 
                      type="time" 
                      name="returnTime"
                      className="form-input" 
                      value={bookingData.returnTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={nextStep}>
                  Continue to Details <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {currentStep === STEPS.DETAILS && (
            <div>
              <h2 className="heading-md mb-6">Driver Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    name="driverName"
                    className="form-input" 
                    value={bookingData.driverName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    name="driverEmail"
                    className="form-input" 
                    value={bookingData.driverEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="driverPhone"
                    className="form-input" 
                    value={bookingData.driverPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Driver's License Number *</label>
                  <input 
                    type="text" 
                    name="driverLicense"
                    className="form-input" 
                    value={bookingData.driverLicense}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group mb-8">
                <label className="form-label">Special Requests (Optional)</label>
                <textarea 
                  name="specialRequests"
                  className="form-input" 
                  rows="3"
                  value={bookingData.specialRequests}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex justify-between">
                <button className="btn btn-outline" onClick={prevStep}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Review Booking <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === STEPS.REVIEW && (
            <div>
              <h2 className="heading-md mb-6">Review Booking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="heading-sm mb-4 border-b pb-2">Vehicle Details</h3>
                  <div className="flex gap-4 items-center mb-4">
                    <img src={vehicle.image} alt={vehicle.name} className="w-24 h-16 object-cover rounded-md" style={{ width: '96px', height: '64px' }} />
                    <div>
                      <div className="font-bold">{vehicle.name}</div>
                      <div className="text-sm text-muted">{vehicle.category} • {vehicle.transmission}</div>
                    </div>
                  </div>
                  
                  <h3 className="heading-sm mb-4 border-b pb-2 mt-6">Driver Details</h3>
                  <div className="text-sm">
                    <div className="mb-1"><span className="text-muted">Name:</span> {bookingData.driverName}</div>
                    <div className="mb-1"><span className="text-muted">Email:</span> {bookingData.driverEmail}</div>
                    <div className="mb-1"><span className="text-muted">Phone:</span> {bookingData.driverPhone}</div>
                    <div className="mb-1"><span className="text-muted">License:</span> {bookingData.driverLicense}</div>
                  </div>
                </div>
                
                <div>
                  <div className="booking-summary-card">
                    <h3 className="heading-sm mb-4">Booking Summary</h3>
                    
                    <div className="summary-row">
                      <span className="text-muted">Pickup</span>
                      <span className="font-medium text-right">{bookingData.pickupDate} <br/> {bookingData.pickupTime}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span className="text-muted">Return</span>
                      <span className="font-medium text-right">{bookingData.returnDate} <br/> {bookingData.returnTime}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span className="text-muted">Rate</span>
                      <span className="font-medium">${vehicle.pricePerDay} / day</span>
                    </div>
                    
                    <div className="summary-total">
                      <span>Total Amount</span>
                      <span className="text-primary-color">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6 border-t">
                <button className="btn btn-outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </button>
                <button className="btn btn-accent" onClick={submitBooking} disabled={isSubmitting}>
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'} <Check size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {currentStep === STEPS.CONFIRMATION && confirmedBooking && (
            <div className="confirmation-card">
              <div className="confirmation-icon">
                <Check size={40} />
              </div>
              <h2 className="heading-lg mb-2">Booking Confirmed!</h2>
              <p className="text-muted mb-6">Your vehicle has been successfully reserved.</p>
              
              <div className="mb-8">
                <div className="text-sm text-muted">Booking Reference</div>
                <div className="reference-id">{confirmedBooking.id}</div>
              </div>
              
              <p className="mb-8 max-w-md mx-auto text-sm" style={{ lineHeight: 1.6 }}>
                A confirmation email has been sent to <strong>{confirmedBooking.customerDetails.email}</strong>. 
                You can view and manage this booking in your Booking History.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/bookings" className="btn btn-primary">
                  View Booking History
                </Link>
                <Link to="/" className="btn btn-outline">
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BookingFlow;

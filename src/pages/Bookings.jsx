import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { mockVehicles } from '../data/vehicles';
import { format, parseISO } from 'date-fns';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const { getUpcomingBookings, getCompletedBookings, getCancelledBookings, cancelBooking } = useBooking();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isCancelling, setIsCancelling] = useState(null); // id of booking being cancelled

  const upcomingBookings = getUpcomingBookings(user.id);
  const completedBookings = getCompletedBookings(user.id);
  const cancelledBookings = getCancelledBookings(user.id);

  let displayedBookings = [];
  if (activeTab === 'upcoming') displayedBookings = upcomingBookings;
  if (activeTab === 'completed') displayedBookings = completedBookings;
  if (activeTab === 'cancelled') displayedBookings = cancelledBookings;

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setIsCancelling(bookingId);
      await cancelBooking(bookingId, user.id);
      setIsCancelling(null);
      // We could switch to cancelled tab, but staying here and watching it disappear is fine
    }
  };

  const getVehicleDetails = (vehicleId) => {
    return mockVehicles.find(v => v.id === vehicleId) || {};
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'Upcoming':
        return <span className="badge badge-warning">Upcoming</span>;
      case 'Completed':
        return <span className="badge badge-success">Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-error">Cancelled</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="page-container container">
      <div className="mb-8">
        <h1 className="heading-lg mb-2">My Bookings</h1>
        <p className="text-muted">View and manage your vehicle reservations.</p>
      </div>

      <div className="bookings-tabs">
        <button 
          className={`booking-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button 
          className={`booking-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedBookings.length})
        </button>
        <button 
          className={`booking-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({cancelledBookings.length})
        </button>
      </div>

      {displayedBookings.length === 0 ? (
        <div className="flex-col items-center justify-center text-center py-16" style={{ display: 'flex' }}>
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '2rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Calendar size={48} className="text-muted" />
          </div>
          <h3 className="heading-md mb-2">No {activeTab} bookings</h3>
          <p className="text-muted mb-6">You don't have any {activeTab} vehicle reservations at the moment.</p>
          <Link to="/vehicles" className="btn btn-primary">
            Browse Fleet
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {displayedBookings.map(booking => {
            const vehicle = getVehicleDetails(booking.vehicleId);
            
            return (
              <div key={booking.id} className="booking-item-card">
                <img src={vehicle.image} alt={vehicle.name} className="booking-vehicle-image" />
                
                <div className="booking-details">
                  <div className="booking-header">
                    <div>
                      <h3 className="heading-sm mb-1">{vehicle.name}</h3>
                      <div className="text-sm text-muted">{vehicle.category} • {vehicle.transmission}</div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  
                  <div className="booking-dates mt-4">
                    <div className="date-box">
                      <div className="date-icon"><Calendar size={18} /></div>
                      <div>
                        <div className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Pickup</div>
                        <div className="text-sm font-medium">{formatDate(booking.pickupDate)}</div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block text-muted">
                      <ArrowRight size={20} />
                    </div>
                    
                    <div className="date-box">
                      <div className="date-icon"><Calendar size={18} /></div>
                      <div>
                        <div className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Return</div>
                        <div className="text-sm font-medium">{formatDate(booking.returnDate)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-sm">
                    <span className="booking-id">Ref: {booking.id}</span>
                    <span className="text-muted">•</span>
                    <span className="font-semibold text-primary-color">Total: ${booking.totalAmount}</span>
                  </div>
                </div>
                
                <div className="booking-actions">
                  <Link to={`/vehicles/${vehicle.id}`} className="btn btn-outline w-full justify-center">
                    View Vehicle
                  </Link>
                  
                  {booking.status === 'Upcoming' && (
                    <button 
                      className="btn btn-ghost w-full justify-center" 
                      style={{ color: 'var(--error)' }}
                      onClick={() => handleCancel(booking.id)}
                      disabled={isCancelling === booking.id}
                    >
                      {isCancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;

import React, { createContext, useState, useEffect, useContext } from 'react';
import { isBefore, isAfter, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('driveflow_bookings');
    if (storedBookings && JSON.parse(storedBookings).length > 0) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error('Failed to parse bookings from local storage:', e);
      }
    } else {
      // Mock Data
      const mockBookings = [
        {
          id: 'BKG-A1B2C3D4',
          vehicleId: 'v1',
          userId: 'u_12345',
          pickupDate: new Date(Date.now() + 86400000).toISOString(),
          returnDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          totalAmount: 255,
          customerDetails: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123-456-7890' },
          status: 'Upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'BKG-X9Y8Z7W6',
          vehicleId: 'v2',
          userId: 'u_67890',
          pickupDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          returnDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          totalAmount: 330,
          customerDetails: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '098-765-4321' },
          status: 'Completed',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: 'BKG-L5M6N7O8',
          vehicleId: 'v4',
          userId: 'u_11223',
          pickupDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          returnDate: new Date(Date.now() + 86400000 * 10).toISOString(),
          totalAmount: 350,
          customerDetails: { firstName: 'Michael', lastName: 'Johnson', email: 'michael@example.com', phone: '555-123-4567' },
          status: 'Upcoming',
          createdAt: new Date().toISOString()
        }
      ];
      setBookings(mockBookings);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever bookings change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('driveflow_bookings', JSON.stringify(bookings));
    }
  }, [bookings, loading]);

  /**
   * Check if a specific vehicle is available for the given dates
   * @param {string} vehicleId 
   * @param {Date|string} pickup 
   * @param {Date|string} returnDate 
   * @returns {boolean} true if available, false if overlapping
   */
  const checkAvailability = (vehicleId, pickup, returnDate) => {
    const requestedStart = typeof pickup === 'string' ? parseISO(pickup) : pickup;
    const requestedEnd = typeof returnDate === 'string' ? parseISO(returnDate) : returnDate;

    if (isBefore(requestedEnd, requestedStart)) {
      return false; // Invalid dates
    }

    // Filter bookings for this specific vehicle that are not cancelled
    const vehicleBookings = bookings.filter(
      (b) => b.vehicleId === vehicleId && b.status !== 'Cancelled'
    );

    for (const booking of vehicleBookings) {
      const bookedStart = parseISO(booking.pickupDate);
      const bookedEnd = parseISO(booking.returnDate);

      // Overlap condition:
      // Requested start is before booked end AND requested end is after booked start
      if (isBefore(requestedStart, bookedEnd) && isAfter(requestedEnd, bookedStart)) {
        return false; // Overlap detected
      }
    }

    return true; // No overlaps
  };

  /**
   * Create a new booking
   */
  const createBooking = async (bookingData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { vehicleId, pickupDate, returnDate, userId, totalAmount, customerDetails } = bookingData;

    // Double check availability before creating
    if (!checkAvailability(vehicleId, pickupDate, returnDate)) {
      throw new Error('Vehicle is no longer available for these dates.');
    }

    const newBooking = {
      id: 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      vehicleId,
      userId,
      pickupDate: typeof pickupDate === 'string' ? pickupDate : pickupDate.toISOString(),
      returnDate: typeof returnDate === 'string' ? returnDate : returnDate.toISOString(),
      totalAmount,
      customerDetails,
      status: 'Upcoming', // 'Upcoming', 'Completed', 'Cancelled'
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  /**
   * Cancel an upcoming booking
   */
  const cancelBooking = async (bookingId, userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId && b.userId === userId && b.status === 'Upcoming') {
          return { ...b, status: 'Cancelled' };
        }
        return b;
      })
    );
  };

  /**
   * Get all bookings for a user
   */
  const getUserBookings = (userId) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const getUpcomingBookings = (userId) => {
    const now = new Date();
    return bookings.filter(
      (b) => b.userId === userId && b.status === 'Upcoming' && isAfter(parseISO(b.returnDate), now)
    );
  };

  const getCompletedBookings = (userId) => {
    const now = new Date();
    return bookings.filter(
      (b) =>
        b.userId === userId &&
        (b.status === 'Completed' || (b.status === 'Upcoming' && isBefore(parseISO(b.returnDate), now)))
    ).map(b => {
      // Auto-update status to completed if past return date
      if (b.status === 'Upcoming' && isBefore(parseISO(b.returnDate), now)) {
         return { ...b, status: 'Completed' };
      }
      return b;
    });
  };

  const getCancelledBookings = (userId) => {
    return bookings.filter((b) => b.userId === userId && b.status === 'Cancelled');
  };

  const getBookingById = (bookingId) => {
    return bookings.find((b) => b.id === bookingId);
  };

  const value = {
    bookings,
    checkAvailability,
    createBooking,
    cancelBooking,
    getUserBookings,
    getUpcomingBookings,
    getCompletedBookings,
    getCancelledBookings,
    getBookingById,
  };

  return (
    <BookingContext.Provider value={value}>
      {!loading && children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

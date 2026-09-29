import React from 'react';
import { useBooking } from '../../context/BookingContext';

const AdminBookings = () => {
  const { bookings } = useBooking();

  return (
    <div className="admin-page">
      <h1>Booking Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle ID</th>
            <th>Pickup</th>
            <th>Return</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.vehicleId}</td>
              <td>{new Date(b.pickupDate).toLocaleDateString()}</td>
              <td>{new Date(b.returnDate).toLocaleDateString()}</td>
              <td>${b.totalAmount}</td>
              <td><span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
              <td>
                <button className="action-btn">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
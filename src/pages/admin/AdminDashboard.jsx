import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { useBooking } from '../../context/BookingContext';
import { useAdmin } from '../../context/AdminContext';
import './Admin.css';

const AdminDashboard = () => {
  const { vehicles } = useVehicle();
  const { bookings } = useBooking();
  const { customers } = useAdmin();

  const totalRevenue = bookings.filter(b => b.status === 'Completed' || b.status === 'Upcoming').reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="admin-page">
      <h1>Dashboard Overview</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p>{vehicles.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
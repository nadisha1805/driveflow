import React from 'react';
import { useVehicle } from '../../context/VehicleContext';

const AdminPricing = () => {
  const { vehicles } = useVehicle();

  return (
    <div className="admin-page">
      <h1>Pricing Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Base Price/Day</th>
            <th>Promotional Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>${v.pricePerDay}</td>
              <td>-</td>
              <td><button className="action-btn edit">Update Price</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPricing;
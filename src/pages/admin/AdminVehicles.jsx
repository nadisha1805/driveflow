import React from 'react';
import { useVehicle } from '../../context/VehicleContext';

const AdminVehicles = () => {
  const { vehicles } = useVehicle();

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Vehicle Management</h1>
        <button className="admin-btn">Add Vehicle</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price/Day</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td><img src={v.image} alt={v.name} style={{width: '50px', borderRadius: '4px'}} /></td>
              <td>{v.name}</td>
              <td>{v.category}</td>
              <td>${v.pricePerDay}</td>
              <td>
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVehicles;
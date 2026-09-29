import React from 'react';
import { useAdmin } from '../../context/AdminContext';

const AdminCoupons = () => {
  const { coupons } = useAdmin();

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Coupon Management</h1>
        <button className="admin-btn">Add Coupon</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Discount</th>
            <th>Min Amount</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.type}</td>
              <td>{c.type === 'percentage' ? `${c.discount}%` : `${c.discount}`}</td>
              <td>${c.minAmount}</td>
              <td>{c.expiryDate}</td>
              <td>{c.active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoupons;
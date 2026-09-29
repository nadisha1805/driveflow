import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([
    { id: 'c1', code: 'WELCOME10', type: 'percentage', discount: 10, minAmount: 100, expiryDate: '2027-12-31', active: true },
    { id: 'c2', code: 'MINUS50', type: 'fixed', discount: 50, minAmount: 200, expiryDate: '2027-12-31', active: true },
  ]);

  useEffect(() => {
    // Determine admin based on some criteria, e.g., email
    if (user && user.email === 'admin@driveflow.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCustomers = localStorage.getItem('driveflow_customers');
    if (storedCustomers && JSON.parse(storedCustomers).length > 0) {
      try {
        setCustomers(JSON.parse(storedCustomers));
      } catch (e) {}
    } else {
        // mock customers
        const mock = [
            { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', registered: '2023-01-15', status: 'Active' },
            { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', registered: '2023-05-20', status: 'Active' },
            { id: 'c3', name: 'Michael Johnson', email: 'michael@example.com', phone: '555-123-4567', registered: '2023-08-11', status: 'Active' },
            { id: 'c4', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '444-987-6543', registered: '2023-11-05', status: 'Inactive' },
            { id: 'c5', name: 'David Wilson', email: 'david.wilson@example.com', phone: '333-555-8888', registered: '2024-02-18', status: 'Active' }
        ];
        setCustomers(mock);
    }

    const storedCoupons = localStorage.getItem('driveflow_coupons');
    if (storedCoupons) {
      try {
        setCoupons(JSON.parse(storedCoupons));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('driveflow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('driveflow_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const value = {
    isAdmin,
    customers,
    coupons,
    setCoupons,
    setCustomers
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
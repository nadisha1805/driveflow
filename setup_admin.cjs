const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const filesToCreate = {
  'context/AdminContext.jsx': `
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
    if (storedCustomers) {
      try {
        setCustomers(JSON.parse(storedCustomers));
      } catch (e) {}
    } else {
        // mock customers
        const mock = [
            { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', registered: '2023-01-15', status: 'Active' },
            { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', registered: '2023-05-20', status: 'Active' }
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
`,
  'context/VehicleContext.jsx': `
import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockVehicles } from '../data/vehicles';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState(['Economy', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Electric']);

  useEffect(() => {
    const storedVehicles = localStorage.getItem('driveflow_vehicles');
    if (storedVehicles) {
      try {
        setVehicles(JSON.parse(storedVehicles));
      } catch (e) {
        setVehicles(mockVehicles);
      }
    } else {
      setVehicles(mockVehicles);
    }

    const storedCategories = localStorage.getItem('driveflow_categories');
    if (storedCategories) {
        try {
            setCategories(JSON.parse(storedCategories));
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem('driveflow_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('driveflow_categories', JSON.stringify(categories));
    }
  }, [categories]);

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: 'v' + Date.now() }]);
  };

  const updateVehicle = (id, updatedData) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updatedData } : v));
  };

  const deleteVehicle = (id) => {
    // In real app, might just set active=false
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const value = {
    vehicles,
    categories,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setCategories
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
`,
  'components/admin/AdminProtectedRoute.jsx': `
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.email !== 'admin@driveflow.com') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
`,
  'pages/admin/AdminLayout.jsx': `
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';
import { LayoutDashboard, Car, CalendarDays, Users, DollarSign, Tag, LogOut, Settings } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>DriveFlow Admin</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'active' : ''}><LayoutDashboard size={20}/> Dashboard</NavLink>
          <NavLink to="/admin/vehicles" className={({isActive}) => isActive ? 'active' : ''}><Car size={20}/> Vehicles</NavLink>
          <NavLink to="/admin/bookings" className={({isActive}) => isActive ? 'active' : ''}><CalendarDays size={20}/> Bookings</NavLink>
          <NavLink to="/admin/customers" className={({isActive}) => isActive ? 'active' : ''}><Users size={20}/> Customers</NavLink>
          <NavLink to="/admin/pricing" className={({isActive}) => isActive ? 'active' : ''}><DollarSign size={20}/> Pricing</NavLink>
          <NavLink to="/admin/coupons" className={({isActive}) => isActive ? 'active' : ''}><Tag size={20}/> Coupons</NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'active' : ''}><Settings size={20}/> Settings</NavLink>
        </nav>
        <div className="admin-logout">
          <button onClick={handleLogout}><LogOut size={20}/> Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
`,
  'pages/admin/AdminLogin.jsx': `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(email !== 'admin@driveflow.com') {
         setError('Unauthorized');
         return;
      }
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Portal</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn">Login as Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
`,
  'pages/admin/AdminDashboard.jsx': `
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
          <p>$\${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
`,
  'pages/admin/AdminVehicles.jsx': `
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
              <td>$\${v.pricePerDay}</td>
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
`,
  'pages/admin/AdminBookings.jsx': `
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
              <td>$\${b.totalAmount}</td>
              <td><span className={\`status-badge \${b.status.toLowerCase()}\`}>{b.status}</span></td>
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
`,
  'pages/admin/AdminCustomers.jsx': `
import React from 'react';
import { useAdmin } from '../../context/AdminContext';

const AdminCustomers = () => {
  const { customers } = useAdmin();

  return (
    <div className="admin-page">
      <h1>Customer Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
`,
  'pages/admin/AdminPricing.jsx': `
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
              <td>$\${v.pricePerDay}</td>
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
`,
  'pages/admin/AdminCoupons.jsx': `
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
              <td>{c.type === 'percentage' ? \`\${c.discount}%\` : \`$\${c.discount}\`}</td>
              <td>$\${c.minAmount}</td>
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
`,
  'pages/admin/Admin.css': `
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-light, #F8F5EE);
}

.admin-sidebar {
  width: 250px;
  background-color: var(--primary-color, #0F3D36);
  color: white;
  display: flex;
  flex-direction: column;
}

.admin-brand {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: var(--secondary-color, #C9A45C);
}

.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.admin-nav a {
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
}

.admin-nav a:hover, .admin-nav a.active {
  background-color: rgba(255,255,255,0.1);
  border-left: 4px solid var(--secondary-color, #C9A45C);
}

.admin-logout {
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.admin-logout button {
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.admin-main {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.admin-page h1 {
  margin-bottom: 20px;
  color: var(--text-dark, #1D2523);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.stat-card h3 {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color, #0F3D36);
}

.admin-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.admin-table th, .admin-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.admin-table th {
  background-color: #f9f9f9;
  font-weight: 600;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.action-btn.edit { color: #0066cc; }
.action-btn.delete { color: #dc3545; }

.admin-btn {
  background-color: var(--primary-color, #0F3D36);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.upcoming { background: #e3f2fd; color: #1976d2; }
.status-badge.completed { background: #e8f5e9; color: #388e3c; }
.status-badge.cancelled { background: #ffebee; color: #d32f2f; }

.admin-login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--background-light, #F8F5EE);
}

.admin-login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.admin-login-card h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--primary-color, #0F3D36);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.admin-btn {
  width: 100%;
  margin-top: 10px;
}
`
};

for (const [relativePath, content] of Object.entries(filesToCreate)) {
  const filePath = path.join(baseDir, relativePath);
  const dirPath = path.dirname(filePath);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content.trim());
  console.log('Created:', filePath);
}

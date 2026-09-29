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
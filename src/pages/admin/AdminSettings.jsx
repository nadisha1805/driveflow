import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminSettings = () => {
  const { user } = useAuth();
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'DriveFlow',
    currency: 'USD',
    taxRate: 10,
    maintenanceMode: false
  });

  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@driveflow.com',
  });

  const [message, setMessage] = useState('');

  const handleGeneralSave = (e) => {
    e.preventDefault();
    setMessage('General settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setMessage('Profile settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {message && <div className="success-message" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Profile Settings */}
        <div className="settings-card stat-card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--primary-color)' }}>Admin Profile</h2>
          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={profileSettings.name} 
                onChange={e => setProfileSettings({...profileSettings, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={profileSettings.email} 
                disabled
                style={{ backgroundColor: '#f5f5f5', color: '#666' }}
              />
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Email cannot be changed.</small>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="Leave blank to keep current" 
              />
            </div>
            <button type="submit" className="admin-btn">Save Profile</button>
          </form>
        </div>

        {/* Platform Settings */}
        <div className="settings-card stat-card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--primary-color)' }}>Platform Settings</h2>
          <form onSubmit={handleGeneralSave}>
            <div className="form-group">
              <label>Site Name</label>
              <input 
                type="text" 
                value={generalSettings.siteName} 
                onChange={e => setGeneralSettings({...generalSettings, siteName: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Currency</label>
                <select 
                  value={generalSettings.currency} 
                  onChange={e => setGeneralSettings({...generalSettings, currency: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label>Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={generalSettings.taxRate} 
                  onChange={e => setGeneralSettings({...generalSettings, taxRate: e.target.value})} 
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
              <input 
                type="checkbox" 
                id="maintenance"
                checked={generalSettings.maintenanceMode} 
                onChange={e => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})} 
                style={{ width: 'auto', transform: 'scale(1.2)' }}
              />
              <label htmlFor="maintenance" style={{ marginBottom: 0, cursor: 'pointer' }}>Enable Maintenance Mode</label>
            </div>
            <button type="submit" className="admin-btn">Save Settings</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;

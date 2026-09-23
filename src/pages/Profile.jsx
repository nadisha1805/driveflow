import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container container">
      <div className="profile-layout">
        
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="heading-md mt-4 mb-1 text-center">{user?.name}</h2>
          <p className="text-muted text-center mb-6">{user?.email}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{new Date().getFullYear()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="badge badge-success">Verified</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="profile-content">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-lg">My Profile</h1>
            {!isEditing && (
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
          
          {message.text && (
            <div className={`alert alert-${message.type} mb-6`}>
              {message.text}
            </div>
          )}
          
          <div className="card p-6">
            <form onSubmit={handleSubmit}>
              <div className="profile-grid">
                
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <User size={16} className="text-muted" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Mail size={16} className="text-muted" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Phone size={16} className="text-muted" />
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input" 
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Shield size={16} className="text-muted" />
                    Account Security
                  </label>
                  <input 
                    type="password" 
                    className="form-input" 
                    value="********"
                    disabled
                  />
                </div>
                
              </div>
              
              {isEditing && (
                <div className="mt-8 flex gap-4 justify-end border-t pt-6">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;

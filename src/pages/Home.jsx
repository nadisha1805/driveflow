import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Clock, MapPin, Star } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { mockVehicles } from '../data/vehicles';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const featuredVehicles = mockVehicles.slice(0, 4); // Get top 4 vehicles

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory) params.append('category', searchCategory);
    if (pickupDate) params.append('date', pickupDate);
    
    navigate({
      pathname: '/vehicles',
      search: params.toString()
    });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container relative">
          <div className="hero-content">
            <span className="hero-subtitle">Premium Car Rental</span>
            <h1 className="heading-xl">Experience the Drive of Your Dreams</h1>
            <p className="hero-desc">
              Choose from our exclusive fleet of premium vehicles. Seamless booking, exceptional service, and unforgettable journeys await.
            </p>
          </div>

          <div className="hero-search-box">
            <form onSubmit={handleSearch}>
              <div className="search-grid">
                <div>
                  <label className="search-label">Vehicle Category</label>
                  <select 
                    className="search-input"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Luxury">Luxury</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric">Electric</option>
                    <option value="Sedan">Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="search-label">Pickup Date</label>
                  <input 
                    type="date" 
                    className="search-input"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button type="submit" className="btn btn-accent w-full" style={{ padding: '1rem 2rem' }}>
                  <Search size={20} />
                  Find Vehicles
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-lg section-title">Featured Fleet</h2>
            <p className="section-desc">Discover our most popular vehicles, maintained to the highest standards for your comfort and safety.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="btn btn-outline" onClick={() => navigate('/vehicles')}>
              View All Vehicles
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-lg section-title">Why Choose DriveFlow</h2>
            <p className="section-desc">We offer more than just a car rental. We provide a premium mobility experience tailored to your needs.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield size={32} />
              </div>
              <h3 className="feature-title">Premium Insurance</h3>
              <p className="text-muted">Comprehensive coverage included with every rental for your peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock size={32} />
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="text-muted">Our dedicated concierge team is available around the clock to assist you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MapPin size={32} />
              </div>
              <h3 className="feature-title">Flexible Locations</h3>
              <p className="text-muted">Pick up and return your vehicle at any of our convenient city locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-lg section-title">How It Works</h2>
            <p className="section-desc">Get behind the wheel in three simple steps.</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Choose Location & Date</h3>
              <p className="text-muted">Select your preferred pickup location and dates for your journey.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Select Your Vehicle</h3>
              <p className="text-muted">Browse our premium fleet and find the perfect match for your needs.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Book & Drive</h3>
              <p className="text-muted">Complete your booking securely and hit the road with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="heading-lg mb-4">Ready for Your Next Adventure?</h2>
            <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Join thousands of satisfied customers who have elevated their travel experience with DriveFlow.
            </p>
            <button className="btn btn-accent" onClick={() => navigate('/vehicles')} style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Browse Vehicles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

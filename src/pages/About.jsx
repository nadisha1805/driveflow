import React from 'react';
import { Shield, Clock, Award, Users } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">About DriveFlow</h1>
          <p className="about-subtitle">Redefining the car rental experience for the modern traveler.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At DriveFlow, we believe that renting a car should be as exciting as the journey itself. 
                Our mission is to provide a seamless, transparent, and premium car rental experience 
                that puts you in control. Whether you're traveling for business, planning a family vacation, 
                or just need a ride for the weekend, we have the perfect vehicle for every occasion.
              </p>
              <p>
                Founded in 2023, we've quickly grown to become a leading provider of premium vehicles, 
                thanks to our unwavering commitment to customer satisfaction, state-of-the-art technology, 
                and a fleet that is constantly updated to ensure safety, comfort, and style.
              </p>
            </div>
            <div className="mission-image">
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000" alt="Premium Car" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="text-center section-title">Why Choose Us</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><Shield size={32} /></div>
              <h3>Safety First</h3>
              <p>Every vehicle in our fleet undergoes rigorous maintenance and safety checks before every rental.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Clock size={32} /></div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is available around the clock to assist you with any questions or emergencies.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Award size={32} /></div>
              <h3>Premium Quality</h3>
              <p>We offer a curated selection of high-quality, modern vehicles equipped with the latest features.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Users size={32} /></div>
              <h3>Customer Centric</h3>
              <p>We put our customers at the heart of everything we do, ensuring a personalized and hassle-free experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

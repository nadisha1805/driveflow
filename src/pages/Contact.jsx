import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">Have questions or need assistance? We're here to help.</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p className="info-desc">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><MapPin size={24} /></div>
                  <div>
                    <h3>Our Location</h3>
                    <p>123 Mobility Way, Suite 100<br/>Beverly Hills, CA 90210</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><Phone size={24} /></div>
                  <div>
                    <h3>Phone Number</h3>
                    <p>+1 (800) 555-0198<br/>Mon-Fri 8am-8pm PST</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><Mail size={24} /></div>
                  <div>
                    <h3>Email Address</h3>
                    <p>support@driveflow.com<br/>info@driveflow.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="form-control" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-control" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      className="form-control" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="form-control" 
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-block">
                    <Send size={18} className="mr-2" /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

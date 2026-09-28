import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Globe, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="DriveFlow" className="footer-logo-icon" style={{ height: '96px', width: 'auto' }} />
            </Link>
            <p className="footer-desc">
              Experience the future of car rentals. Premium vehicles, seamless booking, and exceptional service for your next journey.
            </p>
            <div className="flex gap-4 mt-4 text-muted">
              <a href="#" className="footer-link"><Share2 size={20} /></a>
              <a href="#" className="footer-link"><Globe size={20} /></a>
              <a href="#" className="footer-link"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/vehicles" className="footer-link">Our Fleet</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Legal</h4>
            <div className="footer-links">
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/cancellation" className="footer-link">Cancellation Policy</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Contact</h4>
            <div className="footer-links">
              <div className="flex items-center gap-2 footer-link">
                <MapPin size={18} />
                <span>123 Mobility Way, CA 90210</span>
              </div>
              <div className="flex items-center gap-2 footer-link">
                <Phone size={18} />
                <span>+1 (800) 555-0198</span>
              </div>
              <div className="flex items-center gap-2 footer-link">
                <Mail size={18} />
                <span>support@driveflow.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DriveFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

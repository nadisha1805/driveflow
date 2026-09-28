import React from 'react';
import './Terms.css'; // Reusing the same styles

const Privacy = () => {
  return (
    <div className="policy-page">
      <div className="container policy-container">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-date">Last Updated: September 2026</p>

        <div className="policy-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you use DriveFlow, we may collect personal information including your name, email address, 
              phone number, billing information, and driver's license details necessary for processing your rental.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>Process your reservations and manage your rentals.</li>
              <li>Communicate with you regarding your bookings or customer service inquiries.</li>
              <li>Improve our website and services based on user interactions.</li>
              <li>Comply with legal obligations regarding vehicle rentals.</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Protection</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. 
              All payment transactions are encrypted and processed through secure gateway providers; we do not store 
              your sensitive credit card information on our servers.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties 
              unless we provide users with advance notice. This does not include website hosting partners and other 
              parties who assist us in operating our website or conducting our business, as long as those parties 
              agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, 
              or request deletion of your data, subject to certain legal exceptions related to record-keeping.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

import React from 'react';
import './Terms.css'; // Reusing the same styles

const Cancellation = () => {
  return (
    <div className="policy-page">
      <div className="container policy-container">
        <h1 className="policy-title">Cancellation Policy</h1>
        <p className="policy-date">Last Updated: September 2026</p>

        <div className="policy-content">
          <section>
            <h2>1. Free Cancellation</h2>
            <p>
              We understand that plans change. You can cancel your reservation free of charge up to 48 hours 
              before your scheduled pick-up time. The full amount paid will be refunded to your original payment method.
            </p>
          </section>

          <section>
            <h2>2. Late Cancellations</h2>
            <p>
              If you cancel your reservation less than 48 hours before your scheduled pick-up time, a late 
              cancellation fee equivalent to one day's rental rate will be deducted from your refund.
            </p>
          </section>

          <section>
            <h2>3. No-Shows</h2>
            <p>
              If you fail to pick up your vehicle at the scheduled time and have not canceled the reservation, 
              this will be considered a "No-Show". No refunds will be issued for No-Shows.
            </p>
          </section>

          <section>
            <h2>4. Early Returns</h2>
            <p>
              If you return the vehicle earlier than your scheduled drop-off date, we do not provide refunds 
              for the unused days. The vehicle remains available to you for the duration of the contracted period.
            </p>
          </section>

          <section>
            <h2>5. How to Cancel</h2>
            <p>
              You can cancel your reservation by logging into your account and navigating to "My Bookings", 
              or by contacting our customer support team directly at least 48 hours before your pick-up time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;

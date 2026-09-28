import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="policy-page">
      <div className="container policy-container">
        <h1 className="policy-title">Terms & Conditions</h1>
        <p className="policy-date">Last Updated: September 2026</p>

        <div className="policy-content">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing our website and using our car rental services, you agree to be bound by these Terms & Conditions. 
              If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2>2. Rental Requirements</h2>
            <ul>
              <li>Drivers must be at least 21 years of age (young driver surcharges may apply for those under 25).</li>
              <li>A valid driver's license held for at least one year must be presented at the time of pickup.</li>
              <li>A valid major credit card in the renter's name is required for the deposit.</li>
            </ul>
          </section>

          <section>
            <h2>3. Vehicle Use Restrictions</h2>
            <p>The rented vehicle must NOT be used:</p>
            <ul>
              <li>For any illegal purpose or in connection with any illegal activity.</li>
              <li>To carry passengers or property for hire.</li>
              <li>To tow or push anything.</li>
              <li>In any off-road testing, racing, or driving instruction.</li>
            </ul>
          </section>

          <section>
            <h2>4. Insurance and Liability</h2>
            <p>
              Standard insurance is included in all rentals. However, renters are responsible for any damage 
              up to the deductible amount specified in their rental agreement unless additional coverage is purchased.
            </p>
          </section>

          <section>
            <h2>5. Modifications</h2>
            <p>
              DriveFlow reserves the right to revise these terms at any time. By continuing to use our services 
              after changes are made, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

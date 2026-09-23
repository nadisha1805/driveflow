import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Settings, ArrowRight } from 'lucide-react';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="card card-hover flex flex-col h-full">
      <div className="vehicle-card-image-wrapper">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="vehicle-card-image"
          loading="lazy"
        />
        <div className="vehicle-card-category">{vehicle.category}</div>
      </div>
      
      <div className="vehicle-card-content flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="heading-sm mb-1">{vehicle.name}</h3>
            <div className="text-muted text-sm">{vehicle.category}</div>
          </div>
          <div className="vehicle-card-price">
            <span className="price-amount">${vehicle.pricePerDay}</span>
            <span className="price-period">/day</span>
          </div>
        </div>
        
        <div className="vehicle-card-specs mb-6">
          <div className="spec-item">
            <Settings size={16} className="text-muted" />
            <span className="text-sm">{vehicle.transmission}</span>
          </div>
          <div className="spec-item">
            <Users size={16} className="text-muted" />
            <span className="text-sm">{vehicle.seats} Seats</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} className="text-muted" />
            <span className="text-sm">{vehicle.fuelType}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t">
          <Link to={`/vehicles/${vehicle.id}`} className="btn btn-outline w-full justify-between">
            View Details
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;

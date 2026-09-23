import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { mockVehicles } from '../data/vehicles';
import './Vehicles.css';

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique filter options from data
  const categories = useMemo(() => [...new Set(mockVehicles.map(v => v.category))], []);
  const transmissions = useMemo(() => [...new Set(mockVehicles.map(v => v.transmission))], []);
  const seatOptions = useMemo(() => [...new Set(mockVehicles.map(v => v.seats))].sort(), []);

  // State for active filters
  const [filters, setFilters] = useState({
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    transmissions: [],
    seats: []
  });

  // Handle filter changes
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const currentList = prev[type];
      const newList = currentList.includes(value) 
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      return { ...prev, [type]: newList };
    });
  };

  // Apply filters to get display vehicles
  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter(vehicle => {
      // Search term filter
      if (searchTerm && !vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(vehicle.category)) {
        return false;
      }
      
      // Transmission filter
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(vehicle.transmission)) {
        return false;
      }
      
      // Seats filter
      if (filters.seats.length > 0 && !filters.seats.includes(vehicle.seats)) {
        return false;
      }
      
      return true;
    });
  }, [filters, searchTerm]);

  const FilterContent = () => (
    <>
      <div className="filter-group">
        <h4 className="filter-title">Category</h4>
        {categories.map(cat => (
          <label key={cat} className="filter-option">
            <input 
              type="checkbox" 
              className="filter-checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => toggleFilter('categories', cat)}
            />
            <span className="filter-label">{cat}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4 className="filter-title">Transmission</h4>
        {transmissions.map(trans => (
          <label key={trans} className="filter-option">
            <input 
              type="checkbox" 
              className="filter-checkbox"
              checked={filters.transmissions.includes(trans)}
              onChange={() => toggleFilter('transmissions', trans)}
            />
            <span className="filter-label">{trans}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4 className="filter-title">Seats</h4>
        {seatOptions.map(seat => (
          <label key={seat} className="filter-option">
            <input 
              type="checkbox" 
              className="filter-checkbox"
              checked={filters.seats.includes(seat)}
              onChange={() => toggleFilter('seats', seat)}
            />
            <span className="filter-label">{seat} Seats</span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="page-container container">
      
      <div className="vehicles-header">
        <div>
          <h1 className="heading-lg">Our Fleet</h1>
          <p className="text-muted">Find the perfect vehicle for your next journey.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative" style={{ minWidth: '250px' }}>
            <Search className="absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="form-input w-full"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="mobile-filter-btn" 
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      <div className="vehicles-layout">
        {/* Desktop Sidebar */}
        <aside className="vehicles-sidebar hide-on-mobile">
          <div className="mb-6 flex justify-between items-center border-b pb-4">
            <h3 className="heading-sm">Filters</h3>
            <button 
              className="text-sm text-accent-color font-medium"
              onClick={() => setFilters({ categories: [], transmissions: [], seats: [] })}
            >
              Clear All
            </button>
          </div>
          <FilterContent />
        </aside>

        {/* Since vanilla css doesn't have tailwind hidden by default, we inline it or add it to css. Let's rely on media queries in css */}

        {/* Vehicles Grid */}
        <div className="vehicles-content">
          {filteredVehicles.length === 0 ? (
            <div className="flex-col items-center justify-center text-center py-16" style={{ display: 'flex' }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '2rem', borderRadius: '50%', marginBottom: '1rem' }}>
                <Car size={48} className="text-muted" />
              </div>
              <h3 className="heading-md mb-2">No vehicles found</h3>
              <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
              <button 
                className="btn btn-outline mt-6"
                onClick={() => {
                  setFilters({ categories: [], transmissions: [], seats: [] });
                  setSearchTerm('');
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileFilterOpen && (
        <div 
          className="mobile-filter-overlay show-on-mobile"
          onClick={() => setIsMobileFilterOpen(false)}
        ></div>
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-filter-drawer show-on-mobile ${isMobileFilterOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3 className="heading-sm">Filters</h3>
          <button onClick={() => setIsMobileFilterOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <button 
            className="btn btn-outline w-full mb-6"
            onClick={() => setFilters({ categories: [], transmissions: [], seats: [] })}
          >
            Clear All
          </button>
        </div>
        
        <FilterContent />
        
        <div className="mt-8">
          <button 
            className="btn btn-primary w-full"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Show {filteredVehicles.length} Vehicles
          </button>
        </div>
      </div>
      
    </div>
  );
};

// Quick fix for missing lucide import for the empty state
import { Car } from 'lucide-react';

export default Vehicles;

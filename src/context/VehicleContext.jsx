import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockVehicles } from '../data/vehicles';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState(['Economy', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Electric']);

  useEffect(() => {
    const storedVehicles = localStorage.getItem('driveflow_vehicles');
    if (storedVehicles) {
      try {
        setVehicles(JSON.parse(storedVehicles));
      } catch (e) {
        setVehicles(mockVehicles);
      }
    } else {
      setVehicles(mockVehicles);
    }

    const storedCategories = localStorage.getItem('driveflow_categories');
    if (storedCategories) {
        try {
            setCategories(JSON.parse(storedCategories));
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem('driveflow_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('driveflow_categories', JSON.stringify(categories));
    }
  }, [categories]);

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: 'v' + Date.now() }]);
  };

  const updateVehicle = (id, updatedData) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updatedData } : v));
  };

  const deleteVehicle = (id) => {
    // In real app, might just set active=false
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const value = {
    vehicles,
    categories,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setCategories
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
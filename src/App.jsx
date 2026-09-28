import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const Bookings = lazy(() => import('./pages/Bookings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Cancellation = lazy(() => import('./pages/Cancellation'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <BookingProvider>
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading...</div>}>
            <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetails />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="cancellation" element={<Cancellation />} />
              
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="booking/:vehicleId" 
                element={
                  <ProtectedRoute>
                    <BookingFlow />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="bookings" 
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                } 
              />
            </Route>
            </Routes>
          </Suspense>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

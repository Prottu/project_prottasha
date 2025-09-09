import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Components
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import VehicleList from './components/VehicleList'
import VehicleDetails from './components/VehicleDetails'
import MyBookings from './components/MyBookings'
import AdminDashboard from './components/AdminDashboard'
import PaymentPage from './components/PaymentPage'  // Import PaymentPage

// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            
            {/* Protected Routes */}
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            
            {/* Legacy routes for compatibility */}
            <Route path="/cars" element={<VehicleList />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App

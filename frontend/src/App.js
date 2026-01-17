import React from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/adminDashboard';
import CustomerDashboard from './pages/customerDashboard';
import MyOrders from './pages/MyOrder';

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/my-order' element={<MyOrders />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App
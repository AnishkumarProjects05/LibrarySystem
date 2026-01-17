import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './Register.css';
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Registration successful, please login');
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setMessage(data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h3 className='header'>Library Management System</h3>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#514c9b', textDecoration: 'underline' }}>
            Login here
          </Link>
        </p>

      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;

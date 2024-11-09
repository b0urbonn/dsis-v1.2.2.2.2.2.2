import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../assets/doh-logo.jpeg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy credentials
    const bhwUser = { username: 'bhw', password: 'bhw123' };
    const rhuUser = { username: 'rhu', password: 'rhu123' };
    const adminUser = { username: 'admin', password: 'admin123' };

    // Validate login credentials
    if (username === bhwUser.username && password === bhwUser.password) {
      navigate('/bhw');
    } else if (username === rhuUser.username && password === rhuUser.password) {
      navigate('/rhu');
    } else if (username === adminUser.username && password === adminUser.password) {
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <img src={logo} alt="Logo" className="login-logo" />
        
        {/* Title */}
        <h2 className="login-title">Disease Surveillance<br/>Information System - Marinduque</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username here"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password here"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

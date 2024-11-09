import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import BhwScreen from './pages/bhw';
import RhuScreen from './pages/rhu';
import RhuCases from './pages/rhu/cases';
import RhuReport from './pages/rhu/report';
import PhoScreen from './pages/pho';
import './App.css';

const App = () => {
  const [userType, setUserType] = useState(null);

  const handleLogout = () => {
    setUserType(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={setUserType} />} />
        <Route path="/bhw" element={<BhwScreen userType="BHW" onLogout={handleLogout} />} />
        <Route path="/rhu" element={<RhuScreen userType="RHU" onLogout={handleLogout} />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<RhuHome />} />
          <Route path="cases" element={<RhuCases />} />
          <Route path="report" element={<RhuReport />} />
        </Route>
        <Route path="/pho" element={<PhoScreen userType="PHO" onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
};

const RhuHome = () => {
  return <h2>Welcome to RHU Home</h2>;
};

export default App;
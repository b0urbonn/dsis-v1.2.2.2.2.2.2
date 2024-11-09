import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,  // Import LineChart
  Line        // Import Line
} from 'recharts';

import './user.css';

const municipalities = ['Boac', 'Gasan', 'Mogpog', 'Santa Cruz', 'Buenavista', 'Torrijos'];
const facilities = ['RHU Boac', 'RHU Gasan', 'RHU Mogpog', 'RHU Santa Cruz', 'RHU Buenavista', 'RHU Torijos'];

const UserScreen = ({ userType, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New report submitted', time: '10 minutes ago', read: false },
    { id: 2, message: 'System update available', time: '1 hour ago', read: false },
    { id: 3, message: 'New message from admin', time: '2 hours ago', read: false },
  ]);

  const [activeSection, setActiveSection] = useState('home');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  
  const [dashboardData, setDashboardData] = useState({
    totalCases: 45,
    activeCases: 12,
    recoveredCases: 30,
    recentReports: [
      { id: 1, patient: 'John Doe', address: '123 Main St', healthFacility: 'Marinduque Health Center', disease: 'COVID-19', date: '2024-10-15' },
      { id: 2, patient: 'Jane Smith', address: '456 Oak St', healthFacility: 'RHU Torijos', disease: 'Influenza', date: '2024-10-12' },
    ],
  });

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const chartData = [
    { name: 'Total Cases', count: dashboardData.totalCases },
    { name: 'Active Cases', count: dashboardData.activeCases },
    { name: 'Recovered Cases', count: dashboardData.recoveredCases },
  ];

  const filteredReports = dashboardData.recentReports.filter((report) =>
    (!selectedMunicipality || report.address === selectedMunicipality) &&
    (!selectedFacility || report.healthFacility === selectedFacility) &&
    (dateFilter === 'today' ? report.date === '2024-10-15' : true) // Example logic for date filtering
  );

  const handleAddCase = (e) => {
    e.preventDefault();
    const newCase = {
      id: dashboardData.recentReports.length + 1,
      patient: e.target[0].value,
      address: e.target[1].value,
      healthFacility: e.target[2].value,
      disease: e.target[3].value,
    };

    setDashboardData((prevData) => ({
      ...prevData,
      recentReports: [...prevData.recentReports, newCase],
    }));

    e.target.reset();
  };

  return (
    <div className="user-screen">
      <header className="header">
        <h1>DSIS - {userType}</h1>
        <div className="header-btns">
          <div className="nav-buttons">
            <button onClick={() => setActiveSection('home')}>Home</button>
            <button onClick={() => setActiveSection('cases')}>Cases</button>
            <button onClick={() => setActiveSection('reports')}>Reports</button>
          </div>
          <div className="notification-wrapper">
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-count">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
                      {notification.message} <span className="notification-time">{notification.time}</span>
                      {!notification.read && (
                        <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        {activeSection === 'home' && (
          <div className="dashboard" style={{ width: '100%', display: 'flex', gap: '2rem' }}>
            <div className="welcome-message" style={{ flex: 1 }}>
              <h2>DSIS Dashboard Report and Updates ...</h2>
              <div className="dashboard-stats">
                <div className="stat-item">
                  <h3>Total Cases</h3>
                  <p>{dashboardData.totalCases}</p>
                </div>
                <div className="stat-item">
                  <h3>Active Cases</h3>
                  <p>{dashboardData.activeCases}</p>
                </div>
                <div className="stat-item">
                  <h3>Recovered Cases</h3>
                  <p>{dashboardData.recoveredCases}</p>
                </div>
              </div>
              <h3>Recent Reports</h3>
              <ul className="recent-reports">
                {dashboardData.recentReports.map((report) => (
                  <li key={report.id}>
                    {report.patient} - {report.disease} ({report.date})
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h3>Case Statistics</h3>
              <div className="chart-container" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'cases' && (
          <div className="section-content" style={{ display: 'flex', gap: '2rem' }}>
            {/* Left Column: Table */}
            <div className="cases-table" style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h2>Reported Cases</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Public Health Facility</th>
                    <th>Disease</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.patient}</td>
                      <td>{report.address}</td>
                      <td>{report.healthFacility}</td>
                      <td>{report.disease}</td>
                      <td>
                        <a href={`https://your-form-website.com?caseId=${report.id}`} target="_blank" rel="noopener noreferrer">
                          <button className="show-form-btn">Show Form</button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {activeSection === 'reports' && (
          <div className="section-content" style={{ display: 'flex', gap: '2rem' }}>
            <div className="filters" style={{ flex: 1 }}>
              <h2>Filters</h2>
              <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
                <option value="today">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
              </select>
              <select onChange={(e) => setSelectedMunicipality(e.target.value)} value={selectedMunicipality}>
                <option value="">All Municipalities</option>
                {municipalities.map((mun) => (
                  <option key={mun} value={mun}>
                    {mun}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setSelectedFacility(e.target.value)} value={selectedFacility}>
                <option value="">All Facilities</option>
                {facilities.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
            </div>

            <div className="report-graph" style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h2>Report Graphs</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredReports.map((r) => ({ name: r.patient, cases: 1 }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 DSIS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserScreen;

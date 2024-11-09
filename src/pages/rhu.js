import React, { useState } from 'react';
import { FaBell, FaEdit } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

import './user.css';

const municipalities = ['Boac', 'Gasan', 'Mogpog', 'Santa Cruz', 'Buenavista', 'Torrijos'];
const facilities = ['RHU Boac', 'RHU Gasan', 'RHU Mogpog', 'RHU Santa Cruz', 'RHU Buenavista', 'RHU Torijos'];
const statusOptions = ['Pending', 'Active', 'Recovered', 'Deceased'];

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
  const [editingCase, setEditingCase] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    totalCases: 45,
    activeCases: 12,
    recoveredCases: 30,
    recentReports: [
      { 
        id: 1, 
        patientLName: 'Doe',
        patientFName: 'John',
        patientMI: 'A',
        patientSuffix: '',
        patientBgy: 'Central',
        patientMun: 'Boac',
        patientProv: 'Marinduque',
        patientBdate: '1990-01-01',
        disease: 'COVID-19',
        status: 'Pending',
        date: '2024-10-15'
      },
      { 
        id: 2, 
        patientLName: 'Smith',
        patientFName: 'Jane',
        patientMI: 'B',
        patientSuffix: '',
        patientBgy: 'North',
        patientMun: 'Gasan',
        patientProv: 'Marinduque',
        patientBdate: '1985-05-15',
        disease: 'Influenza',
        status: 'Pending',
        date: '2024-10-12'
      },
    ],
  });

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleAddCase = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCase = {
      id: dashboardData.recentReports.length + 1,
      patientLName: formData.get('patientLName'),
      patientFName: formData.get('patientFName'),
      patientMI: formData.get('patientMI'),
      patientSuffix: formData.get('patientSuffix'),
      patientBgy: formData.get('patientBgy'),
      patientMun: formData.get('patientMun'),
      patientProv: formData.get('patientProv'),
      patientBdate: formData.get('patientBdate'),
      disease: formData.get('disease'),
      status: 'Active',
      date: new Date().toISOString().split('T')[0]
    };

    setDashboardData(prevData => ({
      ...prevData,
      recentReports: [...prevData.recentReports, newCase]
    }));

    e.target.reset();
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
  };

  const handleUpdateCase = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedCase = {
      ...editingCase,
      patientLName: formData.get('patientLName'),
      patientFName: formData.get('patientFName'),
      patientMI: formData.get('patientMI'),
      patientSuffix: formData.get('patientSuffix'),
      patientBgy: formData.get('patientBgy'),
      patientMun: formData.get('patientMun'),
      patientProv: formData.get('patientProv'),
      patientBdate: formData.get('patientBdate'),
      disease: formData.get('disease'),
      status: formData.get('status'),
      clinicalData: {
        fever: formData.get('fever'),
        feverOnsetDate: formData.get('feverOnsetDate'),
        rash: formData.get('rash'),
        rashOnsetDate: formData.get('rashOnsetDate'),
        cough: formData.get('cough'),
        koplikSign: formData.get('koplikSign'),
        runnyNose: formData.get('runnyNose'),
        redEyes: formData.get('redEyes'),
        arthralgia: formData.get('arthralgia'),
        swollenLympheticModule: formData.get('swollenLympheticModule'),
        lympheticLocation: formData.get('lympheticLocation'),
        otherSymptoms: formData.get('otherSymptoms')
      }
    };

    setDashboardData(prevData => ({
      ...prevData,
      recentReports: prevData.recentReports.map(c => 
        c.id === editingCase.id ? updatedCase : c
      )
    }));

    setEditingCase(null);
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
              <h2>Welcome to RHU Dashboard</h2>
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
                    <th>Disease</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentReports.map((report) => (
                    <tr key={report.id}>
                      <td>{`${report.patientLName}, ${report.patientFName} ${report.patientMI}`}</td>
                      <td>{`${report.patientBgy}, ${report.patientMun}, ${report.patientProv}`}</td>
                      <td>{report.disease}</td>
                      <td>{report.status}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditCase(report)}
                        >
                          <FaEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Column: Form */}
            <div className="form-container" style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h2>{editingCase ? 'Edit Case' : 'Add New Case'}</h2>
              <form onSubmit={editingCase ? handleUpdateCase : handleAddCase}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="patientLName">Last Name:</label>
                    <input
                      type="text"
                      id="patientLName"
                      name="patientLName"
                      defaultValue={editingCase?.patientLName}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patientFName">First Name:</label>
                    <input
                      type="text"
                      id="patientFName"
                      name="patientFName"
                      defaultValue={editingCase?.patientFName}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patientMI">Middle Initial:</label>
                    <input
                      type="text"
                      id="patientMI"
                      name="patientMI"
                      defaultValue={editingCase?.patientMI}
                      maxLength="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patientSuffix">Suffix:</label>
                    <input
                      type="text"
                      id="patientSuffix"
                      name="patientSuffix"
                      defaultValue={editingCase?.patientSuffix}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="patientBgy">Barangay:</label>
                    <input
                      type="text"
                      id="patientBgy"
                      name="patientBgy"
                      defaultValue={editingCase?.patientBgy}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patientMun">Municipality:</label>
                    <select
                      id="patientMun"
                      name="patientMun"
                      defaultValue={editingCase?.patientMun}
                      required
                    >
                      <option value="">Select Municipality</option>
                      {municipalities.map(mun => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="patientProv">Province:</label>
                    <input
                      type="text"
                      id="patientProv"
                      name="patientProv"
                      defaultValue={editingCase?.patientProv || 'Marinduque'}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="patientBdate">Birthdate:</label>
                    <input
                      type="date"
                      id="patientBdate"
                      name="patientBdate"
                      defaultValue={editingCase?.patientBdate}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="disease">Disease:</label>
                    <input
                      type="text"
                      id="disease"
                      name="disease"
                      defaultValue={editingCase?.disease}
                      required
                    />
                  </div>
                  {editingCase && (
                    <div className="form-group">
                      <label htmlFor="status">Status:</label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={editingCase.status}
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    {editingCase ? 'Update Case' : 'Submit Report'}
                  </button>
                  {editingCase && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditingCase(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
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
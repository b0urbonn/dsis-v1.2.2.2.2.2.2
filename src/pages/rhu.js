import React, { useState } from 'react';
import { FaBell, FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

const municipalities = ['Boac', 'Gasan', 'Mogpog', 'Santa Cruz', 'Buenavista', 'Torrijos'];
const facilities = ['RHU Boac', 'RHU Gasan', 'RHU Mogpog', 'RHU Santa Cruz', 'RHU Buenavista', 'RHU Torijos'];
const statusOptions = ['', 'Active', 'Recovered', 'Deceased'];

const commonSymptoms = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Body Pain',
  'Sore Throat',
  'Difficulty Breathing',
  'Diarrhea',
  'Loss of Taste/Smell',
  'Runny Nose'
];

// Disease prediction logic based on symptoms
const predictDisease = (symptoms) => {
  const predictions = {
    'Common Cold': {
      symptoms: ['Runny Nose', 'Cough', 'Sore Throat', 'Fatigue'],
      count: 0,
      accuracy: 0
    },
    'Flu': {
      symptoms: ['Fever', 'Body Pain', 'Fatigue', 'Headache', 'Cough'],
      count: 0,
      accuracy: 0
    },
    'COVID-19': {
      symptoms: ['Fever', 'Cough', 'Loss of Taste/Smell', 'Difficulty Breathing', 'Fatigue'],
      count: 0,
      accuracy: 0
    }
  };

  // Calculate matches for each disease
  Object.keys(predictions).forEach(disease => {
    const matchingSymptoms = predictions[disease].symptoms.filter(s => 
      symptoms.includes(s)
    );
    predictions[disease].count = matchingSymptoms.length;
    predictions[disease].accuracy = (matchingSymptoms.length / predictions[disease].symptoms.length) * 100;
  });

  // Find the disease with highest accuracy
  let predictedDisease = Object.entries(predictions)
    .reduce((prev, [disease, data]) => {
      return data.accuracy > prev.accuracy ? { disease, accuracy: data.accuracy } : prev;
    }, { disease: 'Unknown', accuracy: 0 });

  return {
    disease: predictedDisease.disease,
    accuracy: Math.round(predictedDisease.accuracy)
  };
};

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
  const [newSymptom, setNewSymptom] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  
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
        symptoms: ['Fever', 'Cough'],
        status: 'Active',
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
        symptoms: ['Headache', 'Fatigue'],
        status: 'Recovered',
        date: '2024-10-12'
      },
    ],
  });

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  
  const handleAddCustomSymptom = () => {
    if (newSymptom && !customSymptoms.includes(newSymptom)) {
      setCustomSymptoms([...customSymptoms, newSymptom]);
      setNewSymptom('');
    }
  };

  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };
  const handleAddCase = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prediction = predictDisease(selectedSymptoms);
    
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
      symptoms: selectedSymptoms,
      disease: `${prediction.disease} (${prediction.accuracy}%)`,
      status: 'Active',
      date: new Date().toISOString().split('T')[0]
    };

    setDashboardData(prevData => ({
      ...prevData,
      recentReports: [...prevData.recentReports, newCase]
    }));

    setSelectedSymptoms([]);
    e.target.reset();
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setSelectedSymptoms(caseItem.symptoms);
  };

  const handleUpdateCase = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prediction = predictDisease(selectedSymptoms);
    
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
      symptoms: selectedSymptoms,
      disease: `${prediction.disease} (${prediction.accuracy}%)`,
      status: formData.get('status')
    };

    setDashboardData(prevData => ({
      ...prevData,
      recentReports: prevData.recentReports.map(c => 
        c.id === editingCase.id ? updatedCase : c
      )
    }));

    setEditingCase(null);
    setSelectedSymptoms([]);
  };

    // Add state for predicted disease
    const [predictedDisease, setPredictedDisease] = useState({ disease: '', accuracy: 0 });

    // Update prediction whenever symptoms change
    React.useEffect(() => {
      if (selectedSymptoms.length > 0) {
        const prediction = predictDisease(selectedSymptoms);
        setPredictedDisease(prediction);
      } else {
        setPredictedDisease({ disease: '', accuracy: 0 });
      }
    }, [selectedSymptoms]);

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
      <label>Predicted Disease:</label>
      <input
        type="text"
        value={selectedSymptoms.length > 0 ? `${predictedDisease.disease} (${predictedDisease.accuracy}%)` : 'Add symptoms to predict disease'}
        readOnly
        style={{ backgroundColor: '#f3f4f6' }}
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
                 {/* Symptoms Section */}
              <div className="form-row">
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Symptoms:</label>
                  <div className="symptoms-container">
                    {/* Selected Symptoms */}
                    <div className="selected-symptoms" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {selectedSymptoms.map((symptom) => (
                        <span key={symptom} className="symptom-tag" style={{ 
                          backgroundColor: '#e2e8f0', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {symptom}
                          <button
                            type="button"
                            onClick={() => handleRemoveSymptom(symptom)}
                            style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Common Symptoms Dropdown */}
                    <select
                      onChange={(e) => handleSymptomSelect(e.target.value)}
                      value=""
                      className="mb-2"
                    >
                      <option value="">Select Common Symptoms</option>
                      {commonSymptoms.map((symptom) => (
                        <option key={symptom} value={symptom}>{symptom}</option>
                      ))}
                      {customSymptoms.map((symptom) => (
                        <option key={symptom} value={symptom}>{symptom}</option>
                      ))}
                    </select>

                    {/* Add Custom Symptom */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        placeholder="Enter new symptom"
                        className="flex-grow"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSymptom}
                        className="add-symptom-btn"
                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaPlus size={12} /> Add
                      </button>
                    </div>
                  </div>
                </div>
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

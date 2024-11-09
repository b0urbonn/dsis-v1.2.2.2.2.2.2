import React, { useState } from 'react';
import { FaBell, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import './user.css';  
const initialNotifications = [
  { id: 1, message: 'New report submitted', time: '10 minutes ago', read: false, details: 'A new patient report has been submitted for review.' },
  { id: 2, message: 'System update available', time: '1 hour ago', read: false, details: 'A new system update is available. Please update at your earliest convenience.' },
  { id: 3, message: 'New message from admin', time: '2 hours ago', read: false, details: 'You have a new message from the admin regarding recent policy changes.' },
];

const initialReportedCases = [
  { id: 1, patientLName: 'Doe', patientFName: 'John', patientMI: 'A', patientSuffix: '', patientBgy: 'Central', patientMun: 'Springfield', patientProv: 'State', patientBdate: '1994-05-15', susDateReported: '2024-10-15', susDateAdmitted: '2024-10-14', susSymptomResults: 'Fever, Cough' },
  { id: 2, patientLName: 'Smith', patientFName: 'Jane', patientMI: 'B', patientSuffix: '', patientBgy: 'North', patientMun: 'Shelbyville', patientProv: 'State', patientBdate: '1999-08-20', susDateReported: '2024-10-12', susDateAdmitted: '2024-10-11', susSymptomResults: 'Headache, Fatigue' },
];

// Sample symptoms for dropdown
const symptomOptions = [
  'Fever',
  'Cough',
  'Headache',
  'Fatigue',
  'Shortness of breath',
  'Body aches',
  'Loss of taste/smell',
  'Sore throat',
  'Nausea',
  'Diarrhea'
];


// Add disease-symptom mapping
const diseaseSymptomMapping = {
  'COVID-19': {
    symptoms: {
      'Fever': 0.3,
      'Cough': 0.3,
      'Shortness of breath': 0.2,
      'Loss of taste/smell': 0.3,
      'Fatigue': 0.1,
      'Body aches': 0.1,
    },
    minSymptoms: 2
  },
  'Common Cold': {
    symptoms: {
      'Cough': 0.3,
      'Sore throat': 0.3,
      'Fever': 0.1,
      'Fatigue': 0.2,
      'Headache': 0.1
    },
    minSymptoms: 2
  },
  'Influenza': {
    symptoms: {
      'Fever': 0.3,
      'Body aches': 0.2,
      'Fatigue': 0.2,
      'Headache': 0.2,
      'Cough': 0.1
    },
    minSymptoms: 3
  },
  'Gastroenteritis': {
    symptoms: {
      'Nausea': 0.4,
      'Diarrhea': 0.4,
      'Fever': 0.1,
      'Fatigue': 0.1
    },
    minSymptoms: 2
  },
  'Upper Respiratory Infection': {
    symptoms: {
      'Sore throat': 0.3,
      'Cough': 0.3,
      'Headache': 0.2,
      'Fever': 0.1,
      'Fatigue': 0.1
    },
    minSymptoms: 2
  }
};

const UserScreen = ({ userType, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [patientLName, setPatientLName] = useState('');
  const [patientFName, setPatientFName] = useState('');
  const [patientMI, setPatientMI] = useState('');
  const [patientSuffix, setPatientSuffix] = useState('');
  const [patientBgy, setPatientBgy] = useState('');
  const [patientMun, setPatientMun] = useState('');
  const [patientProv, setPatientProv] = useState('');
  const [patientBdate, setPatientBdate] = useState('');
  const [symptoms, setSymptoms] = useState([{ id: 1, value: '' }]);
  const [reportedCases, setReportedCases] = useState(initialReportedCases);
  const [diseasePredictions, setDiseasePredictions] = useState([]);

  const calculatePredictions = (currentSymptoms) => {
    const predictions = [];
    const selectedSymptoms = currentSymptoms
      .map(s => s.value)
      .filter(value => value !== '');

    if (selectedSymptoms.length === 0) {
      setDiseasePredictions([]);
      return;
    }

    Object.entries(diseaseSymptomMapping).forEach(([disease, data]) => {
      let probability = 0;
      let matchedSymptoms = 0;

      selectedSymptoms.forEach(symptom => {
        if (data.symptoms[symptom]) {
          probability += data.symptoms[symptom];
          matchedSymptoms++;
        }
      });

      if (matchedSymptoms >= data.minSymptoms) {
        const normalizedProbability = (probability / matchedSymptoms) * 100;
        predictions.push({
          disease,
          probability: Math.min(Math.round(normalizedProbability), 100)
        });
      }
    });

    setDiseasePredictions(predictions.sort((a, b) => b.probability - a.probability));
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseNotificationDetails = () => {
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleAddSymptom = () => {
    const updatedSymptoms = [...symptoms, { id: symptoms.length + 1, value: '' }];
    setSymptoms(updatedSymptoms);
    calculatePredictions(updatedSymptoms);
  };

  const handleRemoveSymptom = (id) => {
    if (symptoms.length > 1) {
      const updatedSymptoms = symptoms.filter(symptom => symptom.id !== id);
      setSymptoms(updatedSymptoms);
      calculatePredictions(updatedSymptoms);
    }
  };

  const handleSymptomChange = (id, value) => {
    const updatedSymptoms = symptoms.map(symptom =>
      symptom.id === id ? { ...symptom, value } : symptom
    );
    setSymptoms(updatedSymptoms);
    calculatePredictions(updatedSymptoms);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    const symptomsList = symptoms
      .map(s => s.value)
      .filter(value => value !== '')
      .join(', ');

    const newCase = {
      id: reportedCases.length + 1,
      patientLName,
      patientFName,
      patientMI,
      patientSuffix,
      patientBgy,
      patientMun,
      patientProv,
      patientBdate,
      susSymptomResults: symptomsList,
    };
    setReportedCases([...reportedCases, newCase]);
    // Reset form fields
    setPatientLName('');
    setPatientFName('');
    setPatientMI('');
    setPatientSuffix('');
    setPatientBgy('');
    setPatientMun('');
    setPatientProv('');
    setPatientBdate('');
    setSymptoms([{ id: 1, value: '' }]);
    setDiseasePredictions([]);
  };
  
  return (
    <div className="user-screen">
      <header className="header">
        <h1>DSIS - {userType}</h1>
        <div className="header-btns">
          <div className="notification-wrapper">
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-count">{notifications.filter(n => !n.read).length}</span>
              )}
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
                      <a onClick={() => handleNotificationClick(notification)}>
                        {notification.message} <span className="notification-time">{notification.time}</span>
                      </a>
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
      {selectedNotification && (
        <div className="notification-modal">
          <div className="notification-content">
            <h3>{selectedNotification.message}</h3>
            <p>{selectedNotification.details}</p>
            <p><small>{selectedNotification.time}</small></p>
            <button onClick={handleCloseNotificationDetails}>Close</button>
          </div>
        </div>
      )}
     <main className="main-content">
        <div className="report-section">
          <h2>Report Potential Case</h2>
          <form onSubmit={handleSubmitReport} className="report-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientLName">Last Name:</label>
                <input
                  type="text"
                  id="patientLName"
                  value={patientLName}
                  onChange={(e) => setPatientLName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientFName">First Name:</label>
                <input
                  type="text"
                  id="patientFName"
                  value={patientFName}
                  onChange={(e) => setPatientFName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientMI">Middle Initial:</label>
                <input
                  type="text"
                  id="patientMI"
                  value={patientMI}
                  onChange={(e) => setPatientMI(e.target.value)}
                  maxLength="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientSuffix">Suffix:</label>
                <input
                  type="text"
                  id="patientSuffix"
                  value={patientSuffix}
                  onChange={(e) => setPatientSuffix(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientBgy">Barangay:</label>
                <input
                  type="text"
                  id="patientBgy"
                  value={patientBgy}
                  onChange={(e) => setPatientBgy(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientMun">Municipality:</label>
                <input
                  type="text"
                  id="patientMun"
                  value={patientMun}
                  onChange={(e) => setPatientMun(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="patientProv">Province:</label>
                <input
                  type="text"
                  id="patientProv"
                  value={patientProv}
                  onChange={(e) => setPatientProv(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientBdate">Birthdate:</label>
                <input
                  type="date"
                  id="patientBdate"
                  value={patientBdate}
                  onChange={(e) => setPatientBdate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="symptoms-section">
              <div className="symptoms-header">
                <h3>Symptoms</h3>
                <button 
                  type="button" 
                  onClick={handleAddSymptom}
                  className="add-symptom-btn"
                >
                  <FaPlus /> Add Symptom
                </button>
              </div>
              {symptoms.map((symptom, index) => (
                <div key={symptom.id} className="symptom-row">
                  <div className="form-group">
                    <label htmlFor={`symptom-${symptom.id}`}>
                      Symptom {index + 1}:
                    </label>
                    <select
                      id={`symptom-${symptom.id}`}
                      value={symptom.value}
                      onChange={(e) => handleSymptomChange(symptom.id, e.target.value)}
                      required
                    >
                      <option value="">Select a symptom</option>
                      {symptomOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {symptoms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(symptom.id)}
                        className="remove-symptom-btn"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add the disease prediction display here */}
            {diseasePredictions.length > 0 && (
              <div className="disease-predictions">
                <h3>Potential Diseases Based on Symptoms</h3>
                <div className="predictions-container">
                  {diseasePredictions.map((prediction, index) => (
                    <div key={index} className="prediction-item">
                      <div className="disease-name">{prediction.disease}</div>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill" 
                          style={{ 
                            width: `${prediction.probability}%`,
                            backgroundColor: `hsl(${120 - (prediction.probability * 1.2)}, 70%, 45%)`
                          }}
                        ></div>
                        <span className="probability-text">{prediction.probability}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button type="submit" className="submit-btn">Submit Report</button>
          </form>
        </div>
        <div className="divider"></div>
        <div className="table-section">
          <h2>Reported Cases</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>MI</th>
                <th>Barangay</th>
                <th>Municipality</th>
                <th>Birthdate</th>
                <th>Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {reportedCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td>{caseItem.id}</td>
                  <td>{caseItem.patientLName}</td>
                  <td>{caseItem.patientFName}</td>
                  <td>{caseItem.patientMI}</td>
                  <td>{caseItem.patientBgy}</td>
                  <td>{caseItem.patientMun}</td>
                  <td>{caseItem.patientBdate}</td>
                  <td>{caseItem.susSymptomResults}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 DSIS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserScreen;
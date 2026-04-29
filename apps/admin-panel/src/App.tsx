import { useEffect, useState } from 'react';

function App() {
  const[apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

    fetch(`${apiUrl}/status`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to connect to API');
        return res.json();
      })
      .then((data) => {
        setApiStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  },[]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🫐 Blueberry HMS - Admin Dashboard</h1>
      <div style={{ 
        padding: '1rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>System Status Connection Test</h2>
        {loading && <p>Connecting to backend API...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {apiStatus && (
          <div>
            <p><strong>System:</strong> {apiStatus.system}</p>
            <p><strong>Status:</strong> <span style={{color: 'green'}}>{apiStatus.status}</span></p>
            <p><strong>Message:</strong> {apiStatus.message}</p>
            <p><strong>Timestamp:</strong> {apiStatus.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
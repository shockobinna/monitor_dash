import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './config';

function App() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/dashboard`);
        const value = res.data.data[0][0];
        setCount(value);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      }
    };

    fetchCount();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Count Claro</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : count !== null ? (
        <p>Total records: {count}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;

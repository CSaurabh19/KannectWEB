import React, { useEffect, useState } from 'react';

const Dashboard = ({ role }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`/api/dashboard/${role}`)
      .then(res => res.json())
      .then(data => setData(data.dashboard));
  }, [role]);
  return (
    <div style={{ margin: '1em 0', background: '#f6f8fc', padding: '1em', borderRadius: '9px' }}>
      <h2>Dashboard ({role})</h2>
      <pre aria-live="polite">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
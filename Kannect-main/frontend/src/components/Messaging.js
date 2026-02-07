import React, { useState } from 'react';

const Messaging = ({ user }) => {
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const sendMsg = async () => {
    setStatus('');
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: user.email, msg })
    });
    const data = await res.json();
    if (data.status) setStatus('Sent!');
    setMsg('');
  };
  return (
    <div style={{ margin: '1em 0', background: '#eef5fa', padding: '1em', borderRadius: '9px' }}>
      <h3>Messaging ({user.role})</h3>
      <input
        type="text"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Type your message"
        aria-label="Message Input"
      />
      <button onClick={sendMsg} disabled={!msg.length}>Send</button>
      {status && <span aria-live="polite">{status}</span>}
    </div>
  );
};

export default Messaging;
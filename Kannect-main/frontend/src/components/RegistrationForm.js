import React, { useState } from 'react';

const RegistrationForm = ({ onLoggedIn }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [mode, setMode] = useState('register');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const url = mode === 'register' ? '/api/register' : '/api/login';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else onLoggedIn(data.user);
  };

  return (
    <form onSubmit={handleSubmit} aria-label={mode === 'register' ? 'Register Form' : 'Login Form'}>
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      {mode === 'register' && (
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required aria-label="Name" />
      )}
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required aria-label="Email" />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required aria-label="Password" />
      {mode === 'register' && (
        <select name="role" value={form.role} onChange={handleChange} aria-label="Role">
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
      )}
      <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      <div>
        <button type="button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
          Switch to {mode === 'register' ? 'Login' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Messaging from './components/Messaging';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      <h1>KANNECT - User Flow Demo</h1>
      {!user ? (
        <RegistrationForm onLoggedIn={setUser} />
      ) : (
        <>
          <Dashboard role={user.role} />
          <Messaging user={user} />
        </>
      )}
    </div>
  );
};

export default App;
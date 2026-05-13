import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNotice from './domains/notices/AddNotice';
import Certificates from './domains/certificates/Certificates';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/app/notices/add" element={<AddNotice />} />
      <Route path="/app/certificates" element={<Certificates />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;
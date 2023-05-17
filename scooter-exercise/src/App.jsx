import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './screens/login.tsx';
import Home from './screens/home.tsx';

function App() {
  const handleSubmit = (username, password) => {
    // Handle the form submission
    console.log('Submitted:', username, password);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onSubmit={handleSubmit} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
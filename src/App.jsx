import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import P2PExchange from './components/P2PExchange';
import { SignupPage } from './components/SignupPage'; // Use named import with curly braces
import LoginPage from './components/LoginPage';
import WalletComponent from './components/WalletComponent';
import './styles/globals.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<P2PExchange />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/wallet" element={<WalletComponent />} />
      </Routes>
    </Router>
  );
}
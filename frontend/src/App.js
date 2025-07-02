import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import Home from './components/Home';
import LoginSignup from './components/LoginSignup'; 
import Forgetpass from './components/Forgetpass';
import ResetCode from './components/ResetCode';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import Resources from './components/Resources';

import Editprof from './components/Editprof';
import ChangePassword from "./components/ChangePassword";
import AdvisorSelector from './components/AdvisorSelector'




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/forgetpass" element={<Forgetpass />} />
        <Route path="/ResetCode" element={<ResetCode />} />

        <Route path="/" element={<Layout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Planning" element={<Planning />} />
          <Route path="resources" element={<Resources />} />
          <Route path="Editprof" element={<Editprof />} />
          <Route path="ChangePassword" element={<ChangePassword />} />
          <Route path="AdvisorSelector" element={<AdvisorSelector />} />

        </Route>


      </Routes>
    </Router>
  );
}

export default App;

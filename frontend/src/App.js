
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TagentInfo from './components/relatorios/TagentInfo';
import HsplitD1 from './components/relatorios/HsplitD1';
import BilLogD1 from './components/relatorios/BilLogD1';
import HagentD1 from './components/relatorios/HagentD1';
import LoginLogout from './components/relatorios/LoginLogout';
import CallbackDestino from './components/relatorios/CallbackDestino';  
import CallbackOrigem from './components/relatorios/CallbackOrigem';
import AgentsLog from './components/relatorios/AgentsLog';
import PersonalConnectMailing from './components/relatorios/PersonalConnectMailing';

function App() {
  return (
    <Router>
      <div className="app-layout d-flex">
        <Sidebar />
        <div className="main-content p-4" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/tagentinfo" />} />
            <Route path="/tagentinfo" element={<TagentInfo />} />
            <Route path="/hagentD1" element={<HagentD1 />} />
            <Route path="/hsplitD1" element={<HsplitD1 />} />
            <Route path="/billogD1" element={<BilLogD1 />} />
            <Route path="/loginlogout" element={<LoginLogout />} />
            <Route path="/callbackdestino" element={<CallbackDestino />} />
            <Route path="/callbackdeorigem" element={<CallbackOrigem />} />
            <Route path="/agentslog" element={<AgentsLog />} />
            <Route path="/mailingpersonalconnect" element={<PersonalConnectMailing />} />
            <Route path="*" element={<h2>404 - Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



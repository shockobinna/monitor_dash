// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Import your pages or components
// // import Home from './pages/Home';
// // import About from './pages/About';
// // import NotFound from './pages/NotFound';
// import TagentInfo from './components/relatorios/TagentInfo'

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         {/* You can add a navbar or layout here */}
//         <Routes>
//           <Route path="/" element={<TagentInfo />} />
//           {/* <Route path="/about" element={<About />} />
//           <Route path="*" element={<NotFound />} /> */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TagentInfo from './components/relatorios/TagentInfo';
// import InventoryReport from './components/relatorios/InventoryReport';
// import CustomerReport from './components/relatorios/CustomerReport';
// import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout d-flex">
        <Sidebar />
        <div className="main-content p-4" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/tagentinfo" />} />
            <Route path="/tagentinfo" element={<TagentInfo />} />
            {/* <Route path="/hagentD1" element={<InventoryReport />} />
            <Route path="/hsplitD1" element={<CustomerReport />} />
            <Route path="/billogD1" element={<CustomerReport />} /> */}
            <Route path="*" element={<h2>404 - Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



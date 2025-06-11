import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import './Sidebar.css';

const reports = [
  { id: 'tagentinfo', name: 'TagentInfo' },
  { id: 'hagentD1', name: 'HAgentD1' },
  { id: 'hsplitD1', name: 'HSplitD1' },
  { id: 'billogD1', name: 'BillogD1' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Update `isMobile` on screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Decide button label
  const getToggleLabel = () => {
    if (isMobile) {
      return isOpen ? '‹' : '›'; // Arrows for mobile
    } else {
      return isOpen ? 'Close' : 'Open'; // Text for desktop
    }
  };

  return (
    <div className={`sidebar d-flex flex-column ${isOpen ? 'open' : 'closed'}`}>
      <Button
        variant="secondary"
        onClick={toggleSidebar}
        className="m-2 toggle-btn"
      >
        {getToggleLabel()}
      </Button>

      {isOpen && (
        <div className="report-buttons mt-3">
          {reports.map((report) => (
            <Link key={report.id} to={`/${report.id}`} className="m-2">
              <Button variant="outline-light" className="w-100 text-start sidebar-btn">
                {report.name}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

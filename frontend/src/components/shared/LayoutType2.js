import React from 'react';
import BarChartDisplay from '../charts/BarChart';
import './LayoutType2.css';

function LayoutType2({ reportData }) {
  const { c47 = [], c51 = [] } = reportData.groupedData || {};

  return (
    <div className="c47_C51_count">
      {/* C47 Row */}
      <div className="row c47_display">
        <div className="col bar_chart">
          <h3>C47 - Quantities Over Time</h3>
          {c47.length === 0 ? (
            <p>No data available for C47</p>
          ) : (
            <BarChartDisplay
              data={c47.map(item => ({
                process_date: item.process_date,
                c47: item.quantity_processed,
              }))}
              bu="c47"
            />
          )}
        </div>
        <div className="col mini_cards">
          <h3>C47 - Daily Summary</h3>
          <div className="cards-container">
            {c47.map((item, index) => (
              <div key={index} className="card c47">
                <p><strong>Date:</strong> {item.process_date}</p>
                <p><strong>Quantity:</strong> {item.quantity_processed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* C51 Row */}
      <div className="row c51_display">
        <div className="col bar_chart">
          <h3>C51 - Quantities Over Time</h3>
          {c51.length === 0 ? (
            <p>No data available for C51</p>
          ) : (
            <BarChartDisplay
              data={c51.map(item => ({
                process_date: item.process_date,
                c51: item.quantity_processed,
              }))}
              bu="c51"
            />
          )}
        </div>
        <div className="col mini_cards">
          <h3>C51 - Daily Summary</h3>
          <div className="cards-container">
            {c51.map((item, index) => (
              <div key={index} className="card c51">
                <p><strong>Date:</strong> {item.process_date}</p>
                <p><strong>Quantity:</strong> {item.quantity_processed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutType2;

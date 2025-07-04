import LineChart from '../charts/LineChart';
import './LayoutType1.css';
function LayoutType1({ reportData, reportName }) {

  const buLabels = {
    "4602920": "C47",
    "4602389": "C51"
  };

  return (
    <>
      <h3>{reportName} D -0</h3>
      <div className="card-container">
        {["4602920", "4602389"].map((bu) => (
          <div className="card" key={bu}>
            <h2>{buLabels[bu] || `BU: ${bu}`}</h2>
            <table className="table" border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Process Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.groupedData[bu]?.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{item.id || idx + 1}</td>
                    <td>{item.start_date}</td>
                    <td>{item.end_date}</td>
                    <td>{item.process_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className='row my-5'>
        <div className='graph'>
          <div className='card'>
            <h3>{reportName} D -1</h3>
            <LineChart data={reportData.chartData}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default LayoutType1;

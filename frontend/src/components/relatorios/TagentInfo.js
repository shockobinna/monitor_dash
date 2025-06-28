import React, { useEffect} from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
import './TagentInfo.css'
import LineChart from '../../components/charts/LineChart'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTagentData } from '../../features/tagentinfo/tagentInfoSlice';
import { useParams } from 'react-router-dom'; // Assuming React Router


function TagentInfo() {

  const dispatch = useDispatch();
  const { reports, error, loading} = useSelector(state => state.tagentInfo);
  // const { reportName } = useParams(); // gets from URL: /dashboard/:reportName
  const reportName = 'TAGENTINFO';
  const reportData = reports[reportName];

  

  // Mapping BU numbers to labels
  const buLabels = {
    "4602920": "C47",
    "4602389": "C51"
  };

  useEffect(() => {

    dispatch(fetchTagentData({ reportName }));
    
  }, [reportName, dispatch]);

  return (
    <div className="dash-container">
      <div className='row align-items-stretch mb-5'>
        
        <div className='col d-flex align-items-end'>
           <h1 className="title m-0">Dashboard <img className="claro-logo" src={process.env.PUBLIC_URL + '/claro-logo-1-1.png'} alt="Logo" />
          </h1>

        </div>
        <div className='col d-flex justify-content-end gap-2'>
          <input type="date" className="form-control date-input" />
          <input type="date" className="form-control date-input" />
          <button className="btn search-btn">Search</button>
        </div>
        
      </div>
      
  {error ? (
      <p style={{ color: "red" }}>{error}</p>
    ) : !reportData ? (
      <p>{loading}...</p>
    ) : Object.keys(reportData.groupedData).length === 0 ? (
      <p>No data available</p>
    ) : (
      <div className='row'>

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
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {reportData.groupedData[bu]?.map((item, idx) => (
              <tr key={item.id || idx}>
                <td>{item.id || idx + 1}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.process_date}</td>
                <td>{item.quantity_processed || "-"}</td> {/* adjust as needed */}
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
              <h1>Here goes our graph</h1>
              <LineChart data={reportData.chartData} />
          </div>
          
        </div>
          
      </div>
  
  </div>
  
)}

      {/* {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : Object.keys(reportData.groupedData).length === 0 ? (
        <p>Loading...{loading}</p>
      ) : (
        <div className='row'>
          
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
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.groupedData[bu]?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.start_date}</td>
                      <td>{item.end_date}</td>
                      <td>{item.process_date}</td>
                      <td>{item.quantity_processed}</td>
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
              <h1>Here goes our graph</h1>
              <LineChart data={reportData.chartData} />
          </div>
          
        </div>
          
      </div>
        </div>
      )} */}
      
    </div>
  );
}


export default TagentInfo;


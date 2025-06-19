import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import './TagentInfo.css'
import LineChart from '../../components/charts/LineChart'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTagentData } from '../../features/tagentinfo/tagentInfoSlice';


function TagentInfo() {
  // const [groupedData, setGroupedData] = useState({});
  // const [chartData, setChartData] = useState([]);
  // const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { groupedData, chartData, error, loading } = useSelector(state => state.tagentInfo);

  

  // Mapping BU numbers to labels
  const buLabels = {
    "4602920": "C47",
    "4602389": "C51"
  };

  useEffect(() => {

    dispatch(fetchTagentData());
    // const fetchData = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3001/report_name");
    //     const data = res.data;

    //     // Group data by BU
    //     const grouped = data.reduce((acc, item) => {
    //       if (!acc[item.bu]) {
    //         acc[item.bu] = [];
    //       }
    //       acc[item.bu].push(item);
    //       return acc;
    //     }, {});
    //     setGroupedData(grouped);

    //     // Format data for chart
    //     const merged = {};

    //     data.forEach(item => {
    //         const dateOnly = item.process_date.split(" ")[0]; // removes time
    //         const buName = buLabels[item.bu] || item.bu;

    //         if (!merged[dateOnly]) {
    //         merged[dateOnly] = { process_date: dateOnly };
    //         }

    //         merged[dateOnly][buName] = item.quantity_processed;
    //     });

    //     const chartFormatted = Object.values(merged);

    //     // Optional: sort by date (converted to YYYY/MM/DD for accuracy)
    //     chartFormatted.sort((a, b) =>
    //         new Date(a.process_date.split("/").reverse().join("/")) -
    //         new Date(b.process_date.split("/").reverse().join("/"))
    //     );

    //     setChartData(chartFormatted);
    //   } catch (err) {
    //     console.error("Error fetching data:", err);
    //     setError("Failed to load data");
    //   }
    // };

    // fetchData();
  }, [dispatch]);

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
      ) : Object.keys(groupedData).length === 0 ? (
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
                  {groupedData[bu]?.map((item) => (
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
              <LineChart data={chartData} />
          </div>
          
        </div>
          
      </div>
        </div>
      )}
      
    </div>
  );
}


export default TagentInfo;


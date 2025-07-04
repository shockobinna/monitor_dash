import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTagentData } from '../../features/tagentinfo/tagentInfoSlice';
// import { fetchHagentData } from '../../features/hagent/hagentSlice';
// import { fetchBillogData } from '../../features/billog/billogSlice';

import LayoutType1 from './LayoutType1';
// import LayoutType2 from './LayoutType2';
// import LayoutType3 from './LayoutType3';
import './RelatorioLayout.css';

// Configuration object to map reportName to dispatch, slice, and layout
const reportConfig = {
  // First 4 reports - same layout and slice
  TAGENTINFO: {
    layout: LayoutType1,
    fetchAction: fetchTagentData,
    selector: state => state.tagentInfo,
  },
  HAgentD1: {
    layout: LayoutType1,
    fetchAction: fetchTagentData,
    selector: state => state.tagentInfo,
  },
  HSplitD1: {
    layout: LayoutType1,
    fetchAction: fetchTagentData,
    selector: state => state.tagentInfo,
  },
  BILLOGD1: {
    layout: LayoutType1,
    fetchAction: fetchTagentData,
    selector: state => state.tagentInfo,
  },

  // // Next 4 reports - different slice and layout
  // report5: {
  //   layout: LayoutType2,
  //   fetchAction: fetchHagentData,
  //   selector: state => state.hagent,
  // },
  // report6: {
  //   layout: LayoutType2,
  //   fetchAction: fetchHagentData,
  //   selector: state => state.hagent,
  // },
  // report7: {
  //   layout: LayoutType2,
  //   fetchAction: fetchHagentData,
  //   selector: state => state.hagent,
  // },
  // report8: {
  //   layout: LayoutType2,
  //   fetchAction: fetchHagentData,
  //   selector: state => state.hagent,
  // },

  // // Final 4 reports - different slice and layout
  // report9: {
  //   layout: LayoutType3,
  //   fetchAction: fetchBillogData,
  //   selector: state => state.billog,
  // },
  // report10: {
  //   layout: LayoutType3,
  //   fetchAction: fetchBillogData,
  //   selector: state => state.billog,
  // },
  // report11: {
  //   layout: LayoutType3,
  //   fetchAction: fetchBillogData,
  //   selector: state => state.billog,
  // },
  // report12: {
  //   layout: LayoutType3,
  //   fetchAction: fetchBillogData,
  //   selector: state => state.billog,
  // },
};

function ReportLayout({ reportName }) {
  const dispatch = useDispatch();

  const config = reportConfig[reportName];


  const { layout: LayoutComponent, fetchAction, selector } = config;

  const { reports, loading, error } = useSelector(selector);
  const reportData = reports?.[reportName];

  useEffect(() => {
    dispatch(fetchAction({ reportName }));
  }, [dispatch, fetchAction, reportName]);

  // fallback for unknown report
  if (!config) {
    return <p>Invalid or unsupported report name: {reportName}</p>;
  }

  return (
    <div className="dash-container">
      {/* Header with search */}
      <div className='row align-items-stretch mb-5'>
        <div className='col d-flex align-items-end'>
          <h1 className="title m-0">
            Dashboard
            <img className="claro-logo" src={process.env.PUBLIC_URL + '/claro-logo-1-1.png'} alt="Logo" />
          </h1>
        </div>
        <div className='col d-flex justify-content-end gap-2'>
          <input type="date" className="form-control date-input" />
          <input type="date" className="form-control date-input" />
          <button className="btn search-btn">Search</button>
        </div>
      </div>

      {/* Main content */}
      {error ? (
        <p className="text-danger">{error}</p>
      ) : !reportData ? (
        <p>{loading}...</p>
      ) : Object.keys(reportData.groupedData || {}).length === 0 ? (
        <p>No data available</p>
      ) : (
        <LayoutComponent reportData={reportData} reportName={reportName}/>
      )}
    </div>
  );
}

export default ReportLayout;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// BU label mapping
const buLabels = {
  "4602920": "C47",
  "4602389": "C51"
};

export const fetchTagentData = createAsyncThunk(
  'tagentInfo/fetchData',
  async ({ reportName }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/dashboard/${reportName}`);
      console.log(reportName)
      const data = res.data.summary;
      const graphinfo = res.data.totalcount;

      // Group by BU
      const grouped = data.reduce((acc, item) => {
        if (!acc[item.bu]) acc[item.bu] = [];
        acc[item.bu].push(item);
        return acc;
      }, {});

      // Format chart data
      const merged = {};
      graphinfo.forEach(item => {
        const date = item.datadados; // YYYY-MM-DD
        const [year, month, day] = date.split("-");
        const displayDate = `${day}/${month}/${year}`; // DD/MM/YYYY

        const buName = buLabels[item.bu] || item.bu;
        const quantity = item.quantidade;

        if (!merged[displayDate]) {
          merged[displayDate] = { process_date: displayDate };
        }

        merged[displayDate][buName] = quantity;
      });

      const chartFormatted = Object.values(merged).sort((a, b) =>
        new Date(a.process_date.split("/").reverse().join("/")) -
        new Date(b.process_date.split("/").reverse().join("/"))
      );

      return {
        reportName,
        groupedData: grouped,
        chartData: chartFormatted
      };
    } catch (error) {
      return rejectWithValue(error?.message || error.toString());
    }
  }
);
const tagentInfoSlice = createSlice({
  name: 'tagentInfo',
  initialState: {
    reports: {},           // Stores data per report
    currentReport: null,   // Points to currently selected report
    loading: false,
    error: null
  },
  reducers: {
    setCurrentReport(state, action) {
      state.currentReport = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagentData.fulfilled, (state, action) => {
        const { reportName, groupedData, chartData } = action.payload;
        state.loading = false;
        state.reports[reportName] = { groupedData, chartData };
        state.currentReport = reportName;
      })
      .addCase(fetchTagentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentReport } = tagentInfoSlice.actions;
export default tagentInfoSlice.reducer;

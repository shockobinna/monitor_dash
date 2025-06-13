import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// BU label mapping
const buLabels = {
  "4602920": "C47",
  "4602389": "C51"
};

// Async thunk for fetching and formatting the data
export const fetchTagentData = createAsyncThunk(
  'tagentInfo/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:8000/dashboard'); //http://localhost:3001/report_name'
      const data = res.data.report_name;

      // Grouped data by BU
      const grouped = data.reduce((acc, item) => {
        if (!acc[item.bu]) acc[item.bu] = [];
        acc[item.bu].push(item);
        return acc;
      }, {});

      // Format data for chart
      const merged = {};
      data.forEach(item => {
        const dateOnly = item.process_date.split(" ")[0];
        const buName = buLabels[item.bu] || item.bu;

        if (!merged[dateOnly]) {
          merged[dateOnly] = { process_date: dateOnly };
        }

        merged[dateOnly][buName] = item.quantity_processed;
      });

      const chartFormatted = Object.values(merged).sort((a, b) =>
        new Date(a.process_date.split("/").reverse().join("/")) -
        new Date(b.process_date.split("/").reverse().join("/"))
      );

      return {
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
    groupedData: {},
    chartData: [],
    error: null,
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagentData.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedData = action.payload.groupedData;
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchTagentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default tagentInfoSlice.reducer;

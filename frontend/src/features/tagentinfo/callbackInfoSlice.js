
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCallBackData = createAsyncThunk(
  'callbackInfo/fetchData',
  async ({ reportName }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/countreport/${reportName}`);
      console.log(reportName)
      
      const graphinfo = res.data.totalcount;
      console.log(graphinfo)

      // Format chart data
      // This will group data by BU into two separate arrays: c47 and c51
      const grouped = {
        c47: [],
        c51: []
      };

      graphinfo.forEach(item => {
        const date = item.datadados; // 'YYYY-MM-DD'
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`; // 'DD/MM/YYYY'

        const formatted = {
          process_date: formattedDate,
          quantity_processed: item.quantidade
        };

        if (item.bu.toLowerCase() === 'c47') {
          grouped.c47.push(formatted);
        } else if (item.bu.toLowerCase() === 'c51') {
          grouped.c51.push(formatted);
        }
      });

      // Sort each array by date ascending
      grouped.c47.sort((a, b) =>
        new Date(a.process_date.split('/').reverse().join('/')) -
        new Date(b.process_date.split('/').reverse().join('/'))
      );
      grouped.c51.sort((a, b) =>
        new Date(a.process_date.split('/').reverse().join('/')) -
        new Date(b.process_date.split('/').reverse().join('/'))
      );

      return {
        reportName,
        groupedData: grouped
      };
    } catch (error) {
      return rejectWithValue(error?.message || error.toString());
    }

   
  }

);
const callbackInfoSlice = createSlice({
  name: 'callbackInfo',
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
      .addCase(fetchCallBackData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallBackData.fulfilled, (state, action) => {
        const { reportName, groupedData} = action.payload;
        state.loading = false;
        state.reports[reportName] = { groupedData };
        state.currentReport = reportName;
      })
      .addCase(fetchCallBackData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentReport } = callbackInfoSlice.actions;
export default callbackInfoSlice.reducer;

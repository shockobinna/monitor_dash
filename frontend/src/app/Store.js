import { configureStore } from '@reduxjs/toolkit';
import tagentInfoReducer from '../features/tagentinfo/tagentInfoSlice';

export const store = configureStore({
  reducer: {
    tagentInfo: tagentInfoReducer,
  },
});

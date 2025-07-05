import { configureStore } from '@reduxjs/toolkit';
import tagentInfoReducer from '../features/tagentinfo/tagentInfoSlice';
import callbackInfoReducer from '../features/tagentinfo/callbackInfoSlice';

export const store = configureStore({
  reducer: {
    tagentInfo: tagentInfoReducer,
    callbackInfo: callbackInfoReducer
  },
});

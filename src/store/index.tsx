import { configureStore } from "@reduxjs/toolkit";
import  errorSlice from './slSlice'
export const store = configureStore({
  reducer: {
     error:errorSlice.reducer,
  }
})

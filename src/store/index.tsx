//整个文件均由贺艳完成
import { configureStore } from "@reduxjs/toolkit";
import  errorSlice from './slSlice'
export const store = configureStore({
  reducer: {
     error:errorSlice.reducer,
  }
})

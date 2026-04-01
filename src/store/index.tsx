import { configureStore } from "@reduxjs/toolkit";

// export const store = configureStore({
//   reducer: {
//   }
// })


// 创建一个临时的空 reducer 来消除警告
const emptyReducer = (state = {}, action: any) => {
  return state;
};

export const store = configureStore({
  reducer: {
    app: emptyReducer,  // 添加一个空的 reducer
  }
});
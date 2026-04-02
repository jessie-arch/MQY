import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import './assets/fonts/download/font_5134205_7nhog0e2ojf/iconfont.css'
import { RouterProvider } from "react-router-dom";
import router from "./Router/indexRouter";
import { Suspense } from 'react'
import { store } from './store/index'
import { Provider } from 'react-redux'
import {Alert} from './conponents/shared/globalComponent/wrongalert'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  
  <Suspense fallback={<div>页面加载中...</div>}>
      <RouterProvider router={router} />
     <Alert/>
    </Suspense>
    </Provider>
  </StrictMode>,
)

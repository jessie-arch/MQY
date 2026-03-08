import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import './assets/fonts/download/font_5134205_7nhog0e2ojf/iconfont.css'
  import  { RouterProvider } from "react-router-dom";
import router from "./Router/indexRouter";
import { Suspense } from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Suspense fallback={<div>页面加载中...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)

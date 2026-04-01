import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

const MobileHome = lazy(() => import('../conponents/mobile/mobileHome'));
const MobileDetail = lazy(() => import('../conponents/mobile/mobileDetail'));
const MobileAdoptDetail = lazy(() => import('../conponents/mobile/mobileadoptDetail'));
const MobileLogin = lazy(() => import('../conponents/mobile/mobileLogin'));
const MobileRegister = lazy(() => import('../conponents/mobile/mobileRegister'));
const MobileUser = lazy(() => import('../conponents/mobile/mobileUser'));
const mobileRouter = createBrowserRouter([
  {
    path: "/home",
    element: <MobileHome />,
    children: [
      { path: "adoptDetail/:id", element: <MobileAdoptDetail /> }
    ]
  },
  { path: "/home/detail/:id", element: <MobileHome /> },
  { path: "/", element: <MobileLogin /> },
  { path: "/register", element: <MobileRegister /> },
  { path: "/user/profile", element: <MobileUser /> },
  { path: "*", element: <div>404 - 页面不存在</div> }
])

export default mobileRouter;
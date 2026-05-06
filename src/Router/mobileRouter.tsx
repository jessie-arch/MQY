//整个文件均由贺艳完成
import { lazy} from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { getToken } from '.././utils/token';
const Home = lazy(() => import('../conponents/mobile/pages/mobileHome'));
const Detail = lazy(() => import('../conponents/mobile/Home/MobilePostDetailModal'));
const AdoptDetail = lazy(() => import('../conponents/mobile/pages/mobileadoptDetail'));
const Login = lazy(() => import('../conponents/mobile/pages/mobileLogin'));
const Register = lazy(() => import('../conponents/mobile/pages/mobileRegister'));
const User = lazy(() => import('../conponents/mobile/pages/mobileUser'));
import Layout from '../conponents/shared/globalComponent/layOut'
import Guard from "./Guard";

const mobileRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: getToken() ? <Navigate to="/home" /> : <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/home",
        element: <Guard><Home /></Guard>,
        children: [
          {
            path: "detail/:id",
            element: <Guard><Detail /></Guard>
          },
          {
            path: "adoptDetail/:id",
            element: <Guard><AdoptDetail /></Guard>
          }
        ]
      },
      {
        path: "/user",
        element: <Guard><User /></Guard>
      }
    ]
  }
])

export default mobileRouter;
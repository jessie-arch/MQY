import { lazy } from "react"
import {getToken} from '.././utils/token'
import Guard from "./Guard";
import { createBrowserRouter, Navigate } from "react-router-dom"
const Home = lazy(() => import('../conponents/web/pages/webHome'));
const Detail = lazy(() => import('../conponents/web/Home/PostDetailModal'));
const AdoptDetail = lazy(() => import('../conponents/web/pages/webadoptDetail'));
const AddCat = lazy(() => import('../conponents/web/addCat/addCat').then((m) => ({ default: m.AddCat })));
const Login = lazy(() => import('../conponents/web/pages/weblogin').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('../conponents/web/pages/webRegister').then((m) => ({ default: m.Register })));
import Layout from '../conponents/shared/globalComponent/layOut'



const webRouter = createBrowserRouter([
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
          },
          {
            path: "addCat",
            element: <Guard><AddCat /></Guard>
          }
        ]
      }
    ]
  }
])
export default webRouter;
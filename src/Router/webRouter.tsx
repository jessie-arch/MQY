import { lazy, type ReactNode } from "react"
import {getToken} from '.././utils/token'
import { createBrowserRouter, Navigate } from "react-router-dom"
const Home = lazy(() => import('../conponents/web/webHome'));
const Detail = lazy(() => import('../conponents/web/webdetail'));
const AdoptDetail = lazy(() => import('../conponents/web/webadoptDetail'));
const Login = lazy(() => import('../conponents/web/weblogin'));
const Register = lazy(() => import('../conponents/web/webRegister'));
import Layout from '../conponents/shared/layOut'

const Guard = ({children}:{children:ReactNode}) => {
 const isLogin = getToken();
 if(!isLogin){
  return <Navigate to="/"/>
 }
 return children;
}

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
          }
        ]
      }
    ]
  }
])
export default webRouter;
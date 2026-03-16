import { lazy, type ReactNode } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { getToken } from '.././utils/token';
const Home = lazy(() => import('../conponents/mobile/mobileHome'));
const Detail = lazy(() => import('../conponents/mobile/mobileDetail'));
const AdoptDetail = lazy(() => import('../conponents/mobile/mobileadoptDetail'));
const Login = lazy(() => import('../conponents/mobile/mobileLogin'));
const Register = lazy(() => import('../conponents/mobile/mobileRegister'));
const User = lazy(() => import('../conponents/mobile/mobileUser'));

const Guard = ({children}:{children:ReactNode}) => {
 const isLogin = getToken();
 if(!isLogin){
  return <Navigate to="/"/>
 }
 return children;
}

const mobileRouter = createBrowserRouter([
  {
    path: "/home",
    element: <Guard><Home/></Guard>,
    children: [
      {
        path: "detail/:id",
        element: <Guard><Detail/></Guard>
      },
      {
        path: "adoptDetail/:id",
        element: <Guard><AdoptDetail/></Guard>
      }
    ]
  },
  {
    path: "/user",
    element: <Guard><User/></Guard>
  },
  {
    path: "/",
   element:getToken()
      ? <Navigate to="/home"/>
      : <Login/>
  },
  {
    path: "/register",
    element: <Register />
  }
]);

export default mobileRouter;
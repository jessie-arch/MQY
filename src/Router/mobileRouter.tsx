import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

const Home = lazy(() => import('../conponents/mobile/mobileHome'));
const Detail = lazy(() => import('../conponents/mobile/mobileDetail'));
const AdoptDetail = lazy(() => import('../conponents/mobile/mobileadoptDetail'));
const Login = lazy(() => import('../conponents/mobile/mobileLogin'));
const Register = lazy(() => import('../conponents/mobile/mobileRegister'));
const User = lazy(() => import('../conponents/mobile/mobileUser'));

const mobileRouter = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "detail/:id",
        element: <Detail />
      },
      {
        path: "adoptDetail/:id",
        element: <AdoptDetail />
      }
    ]
  },
  {
    path: "/user",
    element: <User />
  },
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

export default mobileRouter;
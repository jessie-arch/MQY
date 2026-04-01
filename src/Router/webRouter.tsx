import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
const Home = lazy(() => import('../conponents/web/Home/webHome'));
const AdoptDetail = lazy(() => import('../conponents/web/Home/webadoptDetail'));
const Login = lazy(() => import('../conponents/web/weblogin'));
const Register = lazy(() => import('../conponents/web/webRegister'));

const webRouter = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "adoptDetail/:id",
        element: <AdoptDetail />
      }
    ]
  },
  {
    path: "/home/detail/:id",
    element: <Home />
  },
  {
    path: "/",
    element: <Login />
  }, {
    path: "/register",
    element: <Register />
  },
  {
    path: "*",
    element: <div>404 - 页面不存在</div>
  }

])
export default webRouter;
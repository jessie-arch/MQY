import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
const Home = lazy(() => import('../conponents/web/webHome'));
const Detail = lazy(() => import('../conponents/web/webdetail'));
const AdoptDetail = lazy(() => import('../conponents/web/webadoptDetail'));
const Login = lazy(() => import('../conponents/web/weblogin'));
const Register = lazy(() => import('../conponents/web/webRegister'));

 const webRouter = createBrowserRouter([
{
  path:"/home",
  element:<Home/>,
  children:[
    {
  path:"detail/:id",
  element:<Detail/>
},
{
  path:"adoptDetail/:id",
  element:<AdoptDetail/>
}
  ]
},
{
  path:"/",
  element:<Login/>
},{
  path:"/register",
  element:<Register/>
}

])
export default webRouter;
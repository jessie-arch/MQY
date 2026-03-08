import { createBrowserRouter } from "react-router-dom"
import MobileLogin from "../conponents/mobile/mobileLogin";

const MobileRouter = createBrowserRouter([
{
  path:"/",
  element:<MobileLogin/>
}
])
export default MobileRouter;

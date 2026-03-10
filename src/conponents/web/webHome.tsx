 import { Link ,Outlet} from "react-router-dom"
 import { NavCat } from "../shared/navCat"
 //主页
 function Home () {
  return(
    <div>
  <NavCat/>
  <Outlet/>
    </div>
  )
 }
 export default Home;

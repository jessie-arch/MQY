 import { Link ,Outlet} from "react-router-dom"
 import { NavCat } from "../shared/navCat"
 import BabyThing from "./BabyinterstingThings";
 //主页
 function Home () {
  return(
    <div >
  <NavCat/>
  <BabyThing/>
  <Outlet/>
    </div>
  )
 }
 export default Home;

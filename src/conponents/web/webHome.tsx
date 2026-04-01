 import { Link ,Outlet} from "react-router-dom"
 import { NavCat } from "../shared/navCat"
 import BabyThing from "./babyInterset/BabyinterstingThings";
 import {AddCat} from './addCat/addCat'
 //主页
 function Home () {
  return(
    <div style={{width:'100%',minHeight:'100dvh'}}>
      <NavCat/>
  <Link to='adoptDetail/:id'></Link>
  <Outlet/>
    </div>
  )
 }
 export default Home;

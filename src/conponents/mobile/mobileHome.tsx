import { Link, Outlet } from "react-router-dom"
import {NavCat} from "../shared/navCat"
import { MbabyInterest } from './babyInterest/mBabyInterestThing'    
import {AddCat} from './addCat/addCat'
function Home() {
    return (
        <div style={{width:'100%',minHeight:'100dvh'}}> 
            <Outlet />
        </div>
    )
}
export default Home;
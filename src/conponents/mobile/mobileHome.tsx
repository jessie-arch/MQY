import { Link, Outlet } from "react-router-dom"
import {NavCat} from "../shared/navCat"

function Home() {
    return (
        <div>
            <NavCat/>
            <Link to="/user">个人主页</Link>
            
            <Outlet />
        </div>
    )
}
export default Home;
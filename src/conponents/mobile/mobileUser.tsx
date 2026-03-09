import { Link } from "react-router-dom"

function MobileUser() {
    return (
        <div>
            <h2>用户主页</h2>
            <Link to="/home">返回主页</Link>
        </div>
    )
}

export default MobileUser
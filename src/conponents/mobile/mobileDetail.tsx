import { Link, useParams } from "react-router-dom"
//动态详情界面
function Detail() {
    const { id } = useParams();
    return (
        <div>
            <h1>动态详情页{id}</h1>
            <Link to="/home">返回主页</Link>
        </div>
    )
}
export default Detail;
 import { Link, useParams } from "react-router-dom"
 //图鉴加领养内页
 function AdoptDetail () {
   const { id } = useParams();
  return(
    <div>
       <h1>领养详情页{id}</h1>
      <Link to= "/home">返回主页</Link>
    </div>
  )
 }
 export default AdoptDetail;

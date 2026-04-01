//  import { Link, useParams } from "react-router-dom"
//  //动态详情界面
//  function Detail () {
//   const { id } = useParams();
//   return(
//     <div>
//       <h1>动态详情页{id}</h1>
//       <Link to= "/home">返回主页</Link>
//     </div>
//   )
//  }
//  export default Detail;




import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { request } from "../../utils/myFetch"

interface DetailData {
  name: string;
  content: string;
  images?: any[];
}

function Detail() {
  const { id } = useParams();
  const [detail, setDetail] = useState<DetailData | null>(null);

  useEffect(() => {
    // 获取详情数据
    const loadDetail = async () => {
      try {
        const res = await request<DetailData>({
          url: `/post/detail/${id}`,
          method: 'GET'
        });
        setDetail(res);
      } catch (error) {
        console.error('加载详情失败:', error);
      }
    };

    loadDetail();
  }, [id]);

  return (
    <div>
      <h1>动态详情页{id}</h1>
      {detail && (
        <div>
          <h2>{detail.name}</h2>
          <p>{detail.content}</p>
        </div>
      )}
      <Link to="/home">返回主页</Link>
    </div>
  );
}

export default Detail;
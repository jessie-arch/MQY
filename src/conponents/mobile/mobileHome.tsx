import { Link, Outlet } from "react-router-dom"
type mockdetailData = {
    id: number,
    title: string
}
type mockData = mockdetailData[]
//演示数据
const data: mockData = [
    { id: 1, title: "这是第一条动态数据" },
    { id: 2, title: "这是第二条动态数据" },
    { id: 3, title: "这是第三条动态数据" },
]
const catData: mockData = [
    { id: 1, title: "这是第一条猫咪数据" },
    { id: 2, title: "这是第二条猫咪数据" },
    { id: 3, title: "这是第三条猫咪数据" },
]
//主页
function Home() {
    return (
        <div>
            <Link to="/user">个人主页</Link>
            {/* 动态列 */}
            {data.map(item => (
                <div key={item.id} >
                    <Link to={`/home/detail/${item.id}`}> {item.title}</Link>
                </div>
            ))}
            {/* 领养数据列 */}
            {catData.map(item => (
                <div key={item.id} >
                    <Link to={`/home/adoptDetail/${item.id}`}>{item.title}</Link>

                </div>
            ))}
            <Outlet />
        </div>
    )
}
export default Home;
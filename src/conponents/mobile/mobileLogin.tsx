import { Link } from 'react-router-dom'
//登录页
function Login() {
  return (
    <div>

      <Link to="/register">没有登录?前往注册</Link>
      <div></div>
      <Link to="./home">登录</Link>
    </div>
  )
}
export default Login;

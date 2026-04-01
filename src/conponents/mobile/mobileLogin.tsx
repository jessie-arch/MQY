import style from '../shared/register/RegitserLoginbackkgroud.module.css'
import { Link } from 'react-router-dom'
import { LoginBannel } from '../shared/login/loginBannel';

//登录页
function Login() {
  
  return (
    <div className={style.register}>
    <LoginBannel/>
      <Link to="/register">没有登录?前往注册</Link>
      <div></div>
      <Link to="./home">登录</Link>
    </div>
  )
}
export default Login;

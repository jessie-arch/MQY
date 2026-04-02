import style from '../shared/register/RegitserLoginbackkgroud.module.css'
import { LoginBannel } from '../shared/login/loginBannel';

//登录页
function Login() {
  
  return (
    <div className={style.register}>
    <LoginBannel/>
    </div>
  )
}

export default Login;
import style from '../shared/RegitserLoginbackkgroud.module.css'
import { RegisterBanner } from "../shared/RegisterBannel"

//注册页
function Register() {
    return (
        <div className={style.register}>
          <RegisterBanner/>
        </div>
    )
}
export default Register;

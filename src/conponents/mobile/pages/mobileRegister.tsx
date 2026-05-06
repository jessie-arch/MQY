//整个文件均由贺艳完成
import style from '../../shared/register/RegitserLoginbackkgroud.module.css'
import { RegisterBanner } from "../../shared/register/RegisterBannel"

//注册页
function Register() {
    return (
        <div className={style.register}>
          <RegisterBanner/>
        </div>
    )
}

export default Register;
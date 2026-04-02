
import { RegisterBanner } from "../shared/register/RegisterBannel"
import style from '../shared/register/RegitserLoginbackkgroud.module.css'
//注册页
export function Register () {
 
  return(
    <div className={style.register}>
      <RegisterBanner/>
    </div>
  )
 }


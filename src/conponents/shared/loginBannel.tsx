import style from './loginBannel.module.css'
import {useState, useRef} from 'react'
import { useNavigate,Link } from 'react-router-dom'; 
import {LoginSubmit} from '../../service/loginFetch'
import {getres} from '../../utils/addSecret'

export function LoginBannel () {
  const Navigate = useNavigate();
  const [showFlag,setShowFlag] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [logininForm,setLogininForm] = useState({
       username:'',
       password:''
  })
  const handleShowFlag = () => {
    const newShowFlag= !showFlag;
        setShowFlag(newShowFlag);
  }
   const handleInputpassWord = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLogininForm({
        ...logininForm,
        password:e.target.value
      })
    }
    const handleInputusername = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLogininForm({
        ...logininForm,
        username:e.target.value
      })
    }
    //登录
    const loginSubmit = () =>{
      if(logininForm.username !='admin'){
        getres(logininForm.password).then((res) => {
          setLogininForm({
        ...logininForm,
        password:res
      })
        })
      }
      LoginSubmit(logininForm);
         Navigate('/home');
    }
  return(
    <div className={style.loginBanner}>
      <h1>登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
      <div className={style.userName}>
        <span className='iconfont icon-yonghu'></span>
        <input type='text'placeholder="username" value={logininForm.username} onChange={handleInputusername}></input>
      </div>
        <div className={style.password}>
        <span className='iconfont icon-jiesuo'/>
        <input type={showFlag?'text':'password'} placeholder="password" value={logininForm.password} onChange={handleInputpassWord} ref={passwordRef}></input>
        <b className={showFlag?'iconfont icon-yanjing':'iconfont icon-biyanjing'} onClick={handleShowFlag}/>
      </div>
      <button className={style.btn} onClick={loginSubmit}>登&nbsp;&nbsp;&nbsp;录</button>
      <Link to='/register' className={style.link}>没有账户？去注册</Link>
    </div>
  )
}
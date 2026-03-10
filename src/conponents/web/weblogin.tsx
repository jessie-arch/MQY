import { useEffect } from 'react';
import { Link } from 'react-router-dom'
//登录页
 function Login () {
  useEffect(() => {
    fetch('http://127.0.0.1:4523/m1/7881239-7631110-default/post/1',{
      method:'get',
      headers:{
        'Content-Type': 'application/json',
        
      }})
      .then(response => response.json())
      .then(data => console.log(data))
    console.log('页面加载时执行的操作');
  }, []); 

  return(
    <div>
      111
      <Link to="/register">没有登录?前往注册</Link>
      <div></div>
      <Link to="./home">登录</Link>
    </div>
  )
 }
 export default Login;
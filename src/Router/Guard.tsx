import { type ReactNode } from "react"
import {getToken} from '.././utils/token'
  import {  Navigate } from "react-router-dom"

const Guard = ({children}:{children:ReactNode}) => {
 const isLogin = getToken();
 if(!isLogin){
  return <Navigate to="/"/>
 }
 return children;
}
export default Guard;
//整个文件均由贺艳完成
import {request} from '../utils/myFetch'
import { setToken} from '../utils/token'

//预签名
type preMark = {
        code:number,
        msg:string,
        data:{
          upload_url:string,
          object_key:string
        }
      }

export async function FetchpreAvator () {
  const res:preMark = await request({
    url:'/auth/avatar-upload-url',
    method:'GET',
  })
  return res;
}

//注册表单提交
type Submit = {
  username:string,
  password:string,
  avatar_key:string
}
type returnSubmit = {
   code:number,
  msg:string,
  data:{
    user_id:number,
    access_token:string,
    expires_in:number
  }
}
export async function SubmitForm (props:Submit) {
  const res:returnSubmit = await request({
    url:'/auth/register',
    method:'POST',
    data:props,
  })
  setToken(res.data.access_token);
   return res;
}

//上传图片
type SubmitImage = {
  file:File,
  uploadURL:string,
}
export async function SubmitImage (props:SubmitImage) {
 const res = await fetch(props.uploadURL,{
    method:'PUT',
    body:props.file,
    headers:{
      'Content-Type':'image/jpeg',
       'Accept': '*/*'
    }
  })
  if(!res.ok){
      console.error('图片上传失败:', res.status, res.statusText);
      throw new Error(`OSS上传失败: ${res.status}`);
  }
} 
type LoginType = {
  username:string,
  password:string
}

type Loginres = {
   code:number,
   msg:string,
   data:{
    user_id:string;
    access_token:string;
    expires_in :number;
   }
}
 
//登录
export async function LoginSubmit (props:LoginType) {
  const res: Loginres = await request({
    url:'/auth/login',
    method:'POST',
    data:props,
  })
   setToken(res.data.access_token);
  return res;
}
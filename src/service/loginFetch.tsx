import {request} from '../utils/myFetch'
import {setToken} from '../utils/token'

//预签名
type preMark = {
        code:number,
        msg:string,
        data:{
          uploadURL:string,
          objectKey:string
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
  userName:string,
  password:string,
  objectKey:string
}
type returnSubmit = {
   code:number,
  msg:string,
  data:{
    userId:number,
    token:string,
    expiresIn:number
  }
}
export async function SubmitForm (props:Submit) {
  const res:returnSubmit = await request({
    url:'/auth/register',
    method:'POST',
    data:props,
  })
   setToken(res.data.token);
   return res;
}

type SubmitImage = {
  file:File,
  uploadURL:string,
}
export async function SubmitImage (props:SubmitImage) {
  const res = await request({
    url:'/auth/avatar-upload-url',
    method:'PUT',
    data:props
  })
  return res;
}
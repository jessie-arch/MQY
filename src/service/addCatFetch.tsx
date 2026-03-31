 import {request} from '../utils/myFetch'
 export type catData = {
  name:string,
  gender: 0 | 1 | null ,
  neutered_status: 0 | 1 | 2 | null ,
  birth_data:string,
  arrival_date:string,
  state: 1 | 2 | 3 | 4 | 5 | null ,
  coat_color: 1 | 2 | 3 | 4 | 5 | 6 | 7  | null ,
  position:string,
  story:string,
  avatar_key:string
 }
 //预签名
 type preMark = {
         code:number,
         msg:string,
         data:{
           upload_url:string,
           object_key:string
         }
       }
 
 export async function FetchpreCatAvator () {
   const res:preMark = await request({
     url:'/cats/avatar-upload-url',
     useToken:true,
     method:'GET',
   })
   return res;
 }
 
 //上传图片
export type SubmitCaimg = {
  file:File ,
  upload_url:string ,
}
export async function SubmitImage (props:SubmitCaimg) {
 const res = await fetch(props.upload_url,{
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
//添加猫咪
export const addCatFetch = async (props:catData) => {
  const res = await request({
    url:'/cats',
    useToken:true,
     method:'POST',
     data:props,
  })
}
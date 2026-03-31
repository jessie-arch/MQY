 import {request} from '../utils/myFetch'

 type Catres = {
    code:number,
    msg:string,
    data:{
      cat_id:number,
      name:string,
      avatar:string,
      gender:number,
      neutered_status:number,
      birth_date:string,
      arrival_date:string,
      status:number,
      coat_color:number,
      position:string,
      story:string,
      user_info:{
        is_following:boolean,
      }
    }
 }
 //获取数据
export async function FetchpreCatdetail (props:number) {
   const res:Catres = await request({
     url:`/cats/${props}`,
     useToken:true,
     method:'GET',
   })
   console.log(res);
   return res;
 }

 //关注猫咪
 export async function followCat (props:number) {
   const res = await request({
     url:`/cats/follow?id=${props}`,
     useToken:true,
     method:'POST',
   })
   console.log(res);
   return res;
 }

 //取消关注
 export async function unfollowCat (props:number) {
   const res = await request({
     url:`/cats/unfollow?id=${props}`,
     useToken:true,
     method:'POST',
   })
   console.log(res);
   return res;
 }
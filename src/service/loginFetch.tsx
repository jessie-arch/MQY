import {request} from '../utils/myFetch'

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
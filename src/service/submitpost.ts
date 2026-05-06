//整个文件均由贺艳完成
import {request} from '../utils/myFetch'

export type MediaCredential = {
  filename:string,
  object_key:string,
  upload_url:string
}

export type PreMarkMedia = {
  code:number,
  msg:string,
  data:{
    credentials:MediaCredential[]
  }
}
 export type PreMediaProps = {
 files:{
  filename:string,
  content_type:string,}[]
}
//预签名
export async function FetchpreMedia (props:PreMediaProps):Promise<PreMarkMedia> {
  const res = await request<PreMarkMedia>({
    url:'/posts/medias/upload-urls',
    method:'POST',
    useToken:true,
    data:props
  })
  return res;
}

//上传图片或者视频
type SubmitImage = {
  file:File,
  uploadURL:string,
}
export async function Submitmedia (props:SubmitImage) {
  const contentType = props.file.type || 'application/octet-stream';
 const res = await fetch(props.uploadURL,{
    method:'PUT',
    body:props.file,
    headers:{
      'Content-Type':contentType,
    }
  })
  if(!res.ok){
     const errText = await res.text();
     console.error('图片上传失败:', res.status, res.statusText);
      throw new Error(`OSS上传失败: ${res.status} ${res.statusText} ${errText}`.trim());
  }
} 

export type mediatype ="IMAGE" | "VIDEO";
//发送动态
export type HandleProps = {
  cat_id:number,
  title:string,
  content:string,
  medias:{
    media_type:mediatype,
    object_key:string
  }[],
}
export async function post (props:HandleProps) {
 const res =  request({
    url:'/posts',
    data:props,
    method:'post',
    useToken:true,
  }
  )
  return res;
}


  type searchCatResType = {
    code:number,
    msg:string,
    data:{
      cat_id:number,
      cat_name:string
    }[]
    }
  
//主角搜索
export async function SearchMainCat (keyword:string) :Promise<searchCatResType>{
  const res: searchCatResType = await request({
    url:`/posts/suggest?keyword=${keyword}`,
    method:'GET',
  })
  return res;
}
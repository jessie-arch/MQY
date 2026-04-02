import style from './BabyinterstingThings.module.css'
import logoCat from '../../../assets/img/logo.svg'
import { useRef, useState} from 'react'
import {setError} from '../../../store/slSlice'
import { useDispatch } from 'react-redux'
import {FetchpreMedia, Submitmedia, post } from '../../../service/submitpost'
import Search from './Search'
import type {mainCatType} from './Search'
import type {PreMediaProps,HandleProps,mediatype} from '../../../service/submitpost'


function BabyThing ({
  setShowAddPost,
  onSubmitted,
}: {
  setShowAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitted?: () => void;
}) 
{
   const [mediasType,setMediasType] = useState<mediatype>("IMAGE")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch(); 
  const mediaRef = useRef<HTMLInputElement | null>(null);
  const [mainCat,setMainCat] = useState<mainCatType| null>(null)
   const [showSearch,setShowSearch] = useState(false);
   const [preView,setpreView] = useState('');
   const [file,setFile]= useState<File | null> (null);
 const [media, setMedia] = useState<PreMediaProps>({ files: [] });
  //表单数据
   const [Form, setForm] = useState<HandleProps>({
  cat_id: 0,
  title: '',
  content: '',
  medias: [],
});
    //显示主角搜索
    const handleShowSearch = () => {
      setShowSearch(true);
    }    

    //处理输入框
    const InputTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...Form,
        title:e.target.value
    })
    }
      const InputContent = (e:React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...Form,
        content:e.target.value
    })
    }

    //处理上传图片或者视频
    //点击
    const HandleClickInput = () => {
       mediaRef.current?.click()
    }
    const HandleInputChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
      const file = e.target.files?.[0];
      if(file){
        Process(file);
      }
    }
    //拖动
    const HandleDrop = (e:React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
       const file = e.dataTransfer.files[0];
        Process(file);
    }
    //更新表单
    const Process = (file:File | null) => {
      if(!file) return;
       const currentMediaType: mediatype = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
       const contentType = file.type || 'application/octet-stream'
       setMediasType(currentMediaType) 
    
        setForm({
    ...Form,
    medias:[ {
          object_key: '',
        media_type: currentMediaType,
         },]
      });
      setMedia({
     files: [{
        filename: file.name,
        content_type: contentType
      },],
    });
    setFile(file);
    setpreView(URL.createObjectURL(file));
    
  }

 const Submit = async () => {
  if (isSubmitting) return;
  try {
    if (!file || media.files.length === 0 || !mainCat || !Form.content || !Form.title ) {
      dispatch(setError('请输入完整的信息哦~'))
      return;
    };
    setIsSubmitting(true);
    const preMark = await FetchpreMedia(media);
    const objectKey = preMark.data.credentials[0].object_key;
    const uploadURL = preMark.data.credentials[0].upload_url;
    await Submitmedia({
      file,
      uploadURL,
    });
    const payload: HandleProps = {
      ...Form,
      cat_id:mainCat?.cat_id,
      medias: [
        {
          media_type: Form.medias[0]?.media_type ?? 'IMAGE',
          object_key: objectKey,
        },
      ],
    };
    await post(payload);
    onSubmitted?.();
  } catch (err) {
    dispatch(setError(err instanceof Error ? err.message : '请求失败'));
  } finally {
    setIsSubmitting(false);
    setShowAddPost(false);
  } 
};

  return(
    <div  className={style.bannel}>
    <nav className={style.nav}>
      <h1 className={style.title}>宝&nbsp;&nbsp;贝&nbsp;&nbsp;趣&nbsp;&nbsp;事</h1>
      <span className={`iconfont icon-cha ${style.out}`} onClick={() => setShowAddPost(false)}></span>
    </nav>

    {showSearch?<Search  setMainCat={setMainCat} setShowSearch={setShowSearch}/>:(
    <div className={style.content}>
        <div className={style.leftpart}>
       <h5>{ mainCat ? mainCat.cat_name : '主角' }</h5>
       <div className={`iconfont icon-jumao ${style.avator}`} onClick={handleShowSearch}></div>
        </div>
 
        <div className={style.form}>
          <input placeholder='添加标题会更有有趣哦' value={Form.title} onChange={InputTitle}></input>
          <input placeholder='这一刻发生了什么呢' value={Form.content} onChange={InputContent}></input>
          <div className={style.addImg}>
            {preView ? (
              mediasType === 'IMAGE' ? (
              <img src={preView} className={style.preview} alt="预览" />
              ) : (
            <video src={preView} className={style.preview} controls />
             )
        ) : (
        <div
        className={`iconfont icon-jiahao1 ${style.Imgbox}`}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
           onDrop={HandleDrop}
       onClick={HandleClickInput}
  />
)}
            <input  type="file" accept="image/jpeg,video/*" style={{display:'none'}}  ref={mediaRef} onChange={HandleInputChange}></input>
            <h5>图片or视频趣事</h5>
          </div>
        </div>
        <div className={style.logoBox}>
    <img src={logoCat} className={style.logoCat}></img>
        </div>
        <button className={style.submit} onClick={Submit} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className={style.submitLoading}>
              <span className={style.spinner}></span>
              发布中
            </span>
          ) : (
            '发送'
          )}
        </button>            
    </div>)}
    </div>
  )
}
export default BabyThing;
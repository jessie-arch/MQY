  import styles from './RegistrtBannel.module.css'
  import { useState,useRef,useEffect } from 'react'
 import {useNavigate} from "react-router-dom"
 import {FetchpreAvator,SubmitForm,SubmitImage} from '../../service/loginFetch'
 import {getres} from '../../utils/addSecret'
   type tavator = {
        file:File | null,
        loading:boolean,
        preView:string,
        url:string
      }
  export function RegisterBanner() {
      const [loginupForm,setLoginupForm] = useState({
        username:'',
        password:'',
       avatar_key:''
      });
      const [ uploadURL,setUploadURL] = useState('');
      const marked = useRef(false);
      const [avator,setAvator] = useState<tavator>({
         file:null,
         loading:false,
         preView:'', //预览的本地url
         url:''
      })
      const inputRef = useRef<HTMLInputElement>(null);
     const Navigate = useNavigate();

    //上传图片相关
     const handClick = () => { inputRef.current?.click() };
     const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
     processFile(file);
  }};

     const handleDrop = (e:React.DragEvent<HTMLDivElement>) => {
       e.preventDefault();
       const file = e.dataTransfer.files[0];
       processFile(file);
     }

     const processFile = (file:File | null | undefined) => {
       if(!file){
        return;
       }
       setAvator({
        file,
        loading:true,
        preView:URL.createObjectURL(file),
        url:''
       })
    }

    const deleteImg = () =>{
     setAvator({
      file:null,
      loading:false,
      preView:'', 
      url:''
     })
     if(inputRef.current) inputRef.current.value = '';
   
    }

    //预签名
    const getPremark = async () => {
      const res =  await FetchpreAvator();
      if(res.data){
        setLoginupForm({
        ...loginupForm,
       avatar_key:res.data.object_key,
        });
         setUploadURL(res.data.upload_url);
      }
    }

    useEffect (()=>{
    if(marked.current === true) {return;}
    else{
       getPremark(); 
      marked.current = true;
    }
    },[])
    //提交图片
     const subImg =() => {
      const file:File | null = avator.file
      if(!file || ! uploadURL ) return ;
       SubmitImage({file,uploadURL})
     
     }
    //提交表单
    const handleInputpassWord = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginupForm({
        ...loginupForm,
        password:e.target.value
      })
    }
    const handleInputusername = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginupForm({
        ...loginupForm,
        username:e.target.value
      })
    }
    const Submit = () => {
      subImg();
      getres(loginupForm.password).then((res) => {
          setLoginupForm({
            ...loginupForm,
            password:res
          })
      })
      SubmitForm(loginupForm);
      Navigate('/home');
    }

 
     //条件渲染相关
     const addImage = () => {
      return(
      <div className={`iconfont icon-jjia- ${styles.addImg}`} onClick= {handClick}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
        onDrop={handleDrop}/>
      )
     }
     const showImage = () => {
     return (
              <div className={styles.avatorContainer}>
              <img  className={styles.avator} src={avator.preView} alt="" />
              <div className={`iconfont icon-cha ${styles.change}`} onClick={deleteImg}></div>
              </div>
              )
     }
     
    return( 
      <div className={styles.loginBanner} >
       {avator.file === null ? addImage(): null }
            {avator.file === null ? null : showImage()}
               <input ref={inputRef} type="file" accept="image/jpeg" style={{display:'none'}} 
       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleFileInputChange(e)}}/>
       <div className={`iconfont icon-cha ${styles.out}`} onClick={() => {Navigate('/')}}/>
       <div className={styles.userName}>
         <input type='text' placeholder='username' value={loginupForm.username} onChange={handleInputusername}/>
       </div> 
        <div className={styles.passWord}>
          <input type='password' placeholder='password' value={loginupForm.password} onChange={handleInputpassWord}/>
        </div> 
       
        <button className={styles.btn} onClick={Submit}>
          注&nbsp;&nbsp;&nbsp;册
          </button>
          
      </div>
    )
  }
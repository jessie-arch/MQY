  import styles from './RegistrtBannel.module.css'
  import { useState,useRef,useEffect } from 'react'
 import {Link} from "react-router-dom"
 import {FetchpreAvator} from '../../service/loginFetch'
  export function RegisterBanner() {
      type tavator = {
        file:File | null,
        loading:boolean,
        preView:string,
        url:string
      }
      
      const [loginupForm,setLoginupForm] = useState({
        userName:'',
        password:'',
        objectKey:''
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


    //上传图片相关
     const handClick = () => { inputRef.current?.click() };

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('1')
    const file = e.target.files?.[0];
    if(file){
     processFile(file);
  }
  };

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
      if(res){
        setLoginupForm({
        ...loginupForm,
        objectKey:res.data.objectKey,
        });
         setUploadURL(res.data.uploadURL);
      }
      console.log(res);
    }

    useEffect (()=>{
    if(marked.current === true) {return;}
    else{ getPremark(); 
      marked.current = true;
    }
    },[])
     


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
       <div className={`iconfont icon-cha ${styles.out}`}/>
       <div className={styles.userName}>
         <input type='text' placeholder='username'/>
       </div> 
        <div className={styles.passWord}>
          <input type='password' placeholder='password'/>
        </div> 
        <Link to="/home">
        <button className={styles.btn}>
          注   册
          </button>
          </Link> 
      </div>
    )
  }
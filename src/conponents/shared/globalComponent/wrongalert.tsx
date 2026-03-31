import style from './wrongAlert.module.css'
import { useDispatch,useSelector } from 'react-redux'
import {clearError} from '../../../store/slSlice'
import {useRef,useEffect} from 'react'
  export  function Alert (){
    const dispatch = useDispatch();
     const errorMsg = useSelector((state:any)=>state.error.message);
    const timeID = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errtime = () => {
      if(timeID.current){  clearTimeout(timeID.current)  };
   
     timeID.current = setTimeout(() => {
      dispatch(clearError());
      clearTime();
     }, 3000)
    }
    const clearTime = () => {
      if(timeID.current){  
        clearTimeout(timeID.current) ;
        timeID.current = null;
       }
    }
  useEffect(() => {
    if(!errorMsg) return;
      console.log(errorMsg);
    errtime();
    return () => clearTime();
  }, [errorMsg]);

    if(!errorMsg) return null;
    return(
      <div>
      <div className={style.alert}>
          <span className={style.triangle}/>
        {errorMsg}
        <button  className={`iconfont icon-cha ${style.out}`} onClick={() => {dispatch(clearError());clearTime()}}></button>
      </div>
      </div>
    )
  }
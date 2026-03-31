import style from './Search.module.css'
import { useState } from 'react'
import { SearchMainCat } from '../../../service/submitpost'
import {setError} from '../../../store/slSlice'
import { useDispatch } from 'react-redux'

export type mainCatType = {
  cat_id: number; cat_name: string
}
function Search ({ setMainCat,setShowSearch}: {  setMainCat: React.Dispatch<React.SetStateAction<mainCatType | null>>;setShowSearch:React.Dispatch<React.SetStateAction<boolean>> }) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [firstShow,setFirstShow] = useState(false);
  const [catData, setCatData] = useState<mainCatType[]>([]);
  const catunfullDate: mainCatType[] = [];
  const [disable,setDisable] = useState<boolean>(false);

  const HandleSubmit = () => {
    setCatData([]);
    setDisable(true);
    if(!inputValue){  dispatch(setError('喵唔~输入提示词之后再搜索吧！')); 
       setDisable(false);
      return;
    }
     SearchMainCat(inputValue).then(res => {
      if(res.code === 200){
        if(res.data.length === 0){
           setDisable(false);
        setInputValue('');
        setFirstShow(true);
          return;
        }else{
        res.data.forEach((item: mainCatType) => {
          catunfullDate.push({ cat_id: item.cat_id, cat_name: item.cat_name });
         });
        setCatData(catunfullDate);
         setDisable(false);
        setInputValue('');
         setFirstShow(true);
      }
       }}
     ).catch( err => (
      dispatch(setError(err))
     )
       )
  }
  return(
    <div>
      <div className={style.searchbox}>
        <input placeholder='搜索更多宠物...' className={style.searchInput} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={disable}></input>
        <button  className={`iconfont icon-sousuo ${disable ? style.disabledbutton : style.button}`}  onClick={HandleSubmit} disabled={disable}></button>
      </div>
    <div className={style.result}> 
   <div className={style.result}>
  {firstShow && catData.length === 0 ? (<div className={style.noFound}>似乎....没有小猫符合条件欸</div> ) : (
    catData.map((item) => (
      <SearchItem
        key={item.cat_id}
        item={item}
        setMainCat={setMainCat}
        setShowSearch={setShowSearch}
      />
    ))
  )}
</div>
    </div>
    </div>
  )
}

type SearchItemProps = {
  item: mainCatType;
  setMainCat: React.Dispatch<React.SetStateAction<mainCatType | null>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchItem ({ item, setMainCat,setShowSearch}: SearchItemProps ){
  const HandleClickitem = ( ) =>{
   setMainCat(item);
   setShowSearch(false);
  }
return(
   <div className={style.resultItem} key={item.cat_id} onClick={HandleClickitem}>
        <span className={`iconfont icon-cat ${style.resultItemIcon}`}></span>
       <span className={style.resultItemName}>{item.cat_name}</span> 
        </div>
)
}
export default Search;
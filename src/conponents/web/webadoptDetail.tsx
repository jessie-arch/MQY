 import {  useParams } from "react-router-dom"
import { Adoptbannel } from "./adoptCatdetail/adoptBannel";
 //图鉴加领养内页
 function AdoptDetail () {
   const { id } = useParams();
  return(
    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", width: "100vw", height: "100vh", position: "fixed", zIndex: 9999,inset:0,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Adoptbannel CatId={4}/>
    </div>
  )
 }
 export default AdoptDetail;

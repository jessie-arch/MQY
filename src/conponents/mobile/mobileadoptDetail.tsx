import { Link, useParams } from "react-router-dom"
import {AdoptCat} from '../mobile/adoptcatdetail/adoptCatbannel'
//图鉴加领养内页
function AdoptDetail() {
    const { id } = useParams();
    return (
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.1)", width: "100%", height: "100%", position: "fixed", zIndex: 9999,inset:0,display:'flex',justifyContent:'center',alignItems:'center'}}>
           <AdoptCat catId={7}/>
        </div>
    )
}
export default AdoptDetail;

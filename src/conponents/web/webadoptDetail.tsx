 //整个文件均由贺艳完成
 import { useEffect } from "react";
 import { useState } from "react";
 import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Adoptbannel } from "./adoptCatdetail/adoptBannel";
import { AdoptFormModal } from "./Home/AdoptFormModal";
 //图鉴加领养内页
 function AdoptDetail () {
   const { id } = useParams();
  const location = useLocation();
   const navigate = useNavigate();
   const catId = Number(id);
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catAvatar, setCatAvatar] = useState('');
  const fromPage = (location.state as { fromPage?: 'guide' | 'adopt'; fromScrollY?: number } | null)?.fromPage;
  const fromScrollY = (location.state as { fromPage?: 'guide' | 'adopt'; fromScrollY?: number } | null)?.fromScrollY;

  //如果没用catid返回首页
   useEffect(() => {
    if (!catId) {
      navigate('/home');
    }
   }, [catId, navigate]);

   if (!catId) return null;

   //处理关闭
   const handleClose = () => {
    navigate('/home', {
      state: {
        restorePage: fromPage || 'adopt',
        restoreScrollY: fromScrollY,
      },
    });
   };

   //打开我要领养表单
   const handleOpenAdoptForm = (_catId: number, name?: string, avatar?: string) => {
    setCatName(name || '');
    setCatAvatar(avatar || '');
    setShowAdoptForm(true);
   };

   //关闭我要领养表单
   const handleCloseAdoptForm = () => {
    setShowAdoptForm(false);
   };

  return(
    <div style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", width: "100vw", height: "100vh", position: "fixed", zIndex: 9999,inset:0,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Adoptbannel CatId={catId} onClose={handleClose} onAdopt={handleOpenAdoptForm} />
      {showAdoptForm && (
        <AdoptFormModal onClose={handleCloseAdoptForm} catName={catName} catAvatar={catAvatar} catId={String(catId)} />
      )}
    </div>
  )
 }
 export default AdoptDetail;

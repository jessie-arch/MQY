//整个文件均由贺艳完成
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {AdoptCat} from '../mobile/adoptcatdetail/adoptCatbannel'
import { MobileAdoptFormModal } from './Home/MobileAdoptFormModal';
//图鉴加领养内页
function AdoptDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [showAdoptForm, setShowAdoptForm] = useState(false);
    const catId = Number(id);
    const fromPage = (location.state as { fromPage?: 'guide' | 'adopt'; fromScrollY?: number } | null)?.fromPage;
    const fromScrollY = (location.state as { fromPage?: 'guide' | 'adopt'; fromScrollY?: number } | null)?.fromScrollY;

    const handleClose = () => {
        navigate('/home', {
            state: {
                restorePage: fromPage || 'guide',
                restoreScrollY: fromScrollY,
            },
        });
    };

    if (!catId || Number.isNaN(catId)) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100dvh",
                zIndex: 9999,
                backgroundColor: "var(--bg-color)",
                overflow: "hidden",
            }}
        >
            {!showAdoptForm && (
                <button
                    type="button"
                    className="iconfont icon-cha"
                    onClick={handleClose}
                    aria-label="关闭"
                    style={{
                        position: "absolute",
                        top: "28px",
                        right: "12px",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#ffffff",
                        color: "var(--theme-color)",
                        zIndex: 10000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "36px",
                        lineHeight: 1,
                        padding: 0,
                        cursor: "pointer",
                    }}
                />
            )}
           <AdoptCat catId={catId} onAdopt={() => setShowAdoptForm(true)} hideActionButtons={showAdoptForm} />
           {showAdoptForm && (
                <MobileAdoptFormModal
                    onClose={() => setShowAdoptForm(false)}
                    catId={String(catId)}
                />
            )}
        </div>
    )
}
export default AdoptDetail;

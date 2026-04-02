//整个文件均由章思雨完成
import type { GalleryCat } from '../../service';
import { getGenderText, getStateClass, getStateText } from '../web/Home/webHome.utils';
import style from '../web/webHome.module.css';
import { useNavigate } from 'react-router-dom';
interface CatCardProps {
    cat: GalleryCat;
    showAdoptBtn?: boolean;
    sourcePage?: 'guide' | 'adopt';
}

export const CatCard: React.FC<CatCardProps> = ({ cat, showAdoptBtn = false, sourcePage }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/home/adoptDetail/${cat.cat_id}`, {
            state: {
                fromPage: sourcePage,
                fromScrollY: window.scrollY,
            },
        });
    };

    const handleAdoptClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            navigate(`/home/adoptDetail/${cat.cat_id}`, {
                state: {
                    fromPage: sourcePage,
                    fromScrollY: window.scrollY,
                },
            });
        } else {
            navigate(`/home/adoptDetail/${cat.cat_id}`, {
                state: {
                    fromPage: sourcePage,
                    fromScrollY: window.scrollY,
                },
            });
        }
    };

    return (
        <div className={style.card} onClick={handleCardClick}>
            <div className={style.imageContainer}>
                <img
                    src={cat.avatar}
                    alt={cat.name}
                    className={style.image}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23ccc"%3E%3Ccircle cx="12" cy="8" r="4"%3E%3C/circle%3E%3Cpath d="M5 20v-2a7 7 0 0 1 14 0v2"%3E%3C/path%3E%3C/svg%3E';
                    }}
                />
            </div>
            <div className={style.content}>
                <div className={style.title}>
                    <strong>{cat.name}</strong>
                </div>
                <div className={style.userInfo}>
                    <div className={style.userInfoText}>
                        <strong className={style.userName}>{getGenderText(cat.gender)}</strong>
                        <span className={style.catName}>{cat.position}</span>
                    </div>
                </div>
                <div className={style.interaction}>
                    <span className={style.likeInfo}>
                        <span className={style.likeIcon}>📍</span>
                        <span>{cat.position}</span>
                    </span>
                    {showAdoptBtn ? (
                        <span className={getStateClass(cat.state, style)}>
                            {getStateText(cat.state)}
                        </span>
                    ) : (
                        <span className={getStateClass(cat.state, style)}>
                            {getStateText(cat.state)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
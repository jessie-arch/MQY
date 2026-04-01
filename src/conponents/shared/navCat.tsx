import { useLocation } from 'react-router-dom';
import logoCat from '../../assets/img/logo.svg'
import { useNavigate } from 'react-router-dom';
import styles from './navCat.module.css';

interface NavCatProps {
  showAvatar?: boolean;
  avatarUrl?: string;
  onAvatarClick?: () => void;
}
export function NavCat({ showAvatar = false, avatarUrl, onAvatarClick }: NavCatProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = location.pathname === '/home' && showAvatar;
  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
    } else {
      navigate('/user/profile');
    }
  };
  return (
    <div className={styles.navbar}>
      <img src={logoCat} alt="logo" className={styles.logo} />

      {showAvatar && (
        <div
          onClick={handleAvatarClick}
          className={styles.avatarWrapper}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.avatarDefault}>🐱</span>
          )}
        </div>
      )}
    </div>
  )
}

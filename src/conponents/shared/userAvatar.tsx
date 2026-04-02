import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersService, type UserInfo } from '../../service/usersService';
import { removeToken } from '../../utils/token';
import style from './userAvatar.module.css';

interface UserAvatarProps {
    onLoginCheck?: (isLoggedIn: boolean) => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ onLoginCheck }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showPanel, setShowPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const panelRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const res = await usersService.getUserInfo();
            if (res.code === 200 && res.data) {
                setUserInfo(res.data);
                onLoginCheck?.(true);
            } else {
                setUserInfo(null);
                onLoginCheck?.(false);
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            setUserInfo(null);
            onLoginCheck?.(false);
        } finally {
            setLoading(false);
        }
    };

    // 组件加载时检查登录状态
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 点击外部关闭面板
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setShowPanel(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // 退出登录
    const handleLogout = () => {
        removeToken();
        setUserInfo(null);
        setShowPanel(false);
        onLoginCheck?.(false);
        navigate('/', { replace: true });
    };

    if (loading) {
        return null;
    }

    if (!userInfo) {
        return null;
    }

    return (
        <div className={style.avatarWrapper}>
            {/* 头像 */}
            <div
                ref={avatarRef}
                className={style.avatar}
                onClick={() => setShowPanel(!showPanel)}
            >
                {userInfo.avatar_url ? (
                    <img
                        src={userInfo.avatar_url}
                        alt={userInfo.name}
                        className={style.avatarImg}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1.5"%3E%3Ccircle cx="12" cy="8" r="4"%3E%3C/circle%3E%3Cpath d="M5 20v-2a7 7 0 0 1 14 0v2"%3E%3C/path%3E%3C/svg%3E';
                        }}
                    />
                ) : (
                    <div className={style.avatarDefault}>
                        {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>

            {/* 用户信息面板 */}
            {showPanel && (
                <div ref={panelRef} className={style.userPanel}>
                    {/* 用户基本信息 */}
                    <div className={style.userInfoSection}>
                        <div className={style.panelAvatar}>
                            {userInfo.avatar_url ? (
                                <img src={userInfo.avatar_url} alt={userInfo.name} />
                            ) : (
                                <div className={style.panelAvatarDefault}>
                                    {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className={style.userName}>{userInfo.name}</div>
                        <div className={style.userRole}>{userInfo.role === 'USER' ? '普通用户' : '管理员'}</div>
                    </div>

                    {/* 统计数据 */}
                    <div className={style.statsSection}>
                        <div className={style.statItem}>
                            <span className={style.statValue}>{userInfo.user_post_count ?? 0}</span>
                            <span className={style.statLabel}>动态</span>
                        </div>
                        <div className={style.statItem}>
                            <span className={style.statValue}>{userInfo.user_follow_count ?? 0}</span>
                            <span className={style.statLabel}>关注</span>
                        </div>
                        <div className={style.statItem}>
                            <span className={style.statValue}>{userInfo.user_like_count ?? 0}</span>
                            <span className={style.statLabel}>获赞</span>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className={style.actionsSection}>
                        <button className={`${style.actionBtn} ${style.logoutBtn}`} onClick={handleLogout}>
                            <i className="iconfont icon-jiesuo"></i>
                            退出登录
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
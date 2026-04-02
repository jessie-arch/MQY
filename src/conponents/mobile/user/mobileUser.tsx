import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoCat from '../../../assets/img/logo.svg'
import { removeToken } from '../../../utils/token';
import { usersService, type UsersInfo } from '../../../service';
import styles from './mobileUser.module.css';

function MobileUser() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UsersInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userRes = await usersService.getUserInfo();
                if (userRes.code !== 200 || !userRes.data) {
                    navigate('/');
                    return;
                }

                if (mounted) {
                    setUserInfo(userRes.data);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                navigate('/');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void fetchUserData();

        return () => {
            mounted = false;
        };
    }, [navigate]);

    // 返回上一页
    const handleBack = () => {
        navigate(-1);
    };

    // 退出登录
    const handleLogout = () => {
        removeToken();
        navigate('/', { replace: true });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                加载中...
            </div>
        );
    }

    if (!userInfo) {
        return null;
    }

    // 获取统计数据，没有则显示 0
    const postCount = userInfo.user_post_count ?? 0;
    const followCount = userInfo.user_follow_count ?? 0;
    const likeCount = userInfo.user_like_count ?? 0;

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={handleBack}>
                ×
            </button>
            {/* 用户信息卡片 - 顶部 */}
            <div className={styles.userInfoCard}>
                <div className={styles.avatarWrapper}>
                    {userInfo.avatar_url ? (
                        <img
                            src={userInfo.avatar_url}
                            alt={userInfo.name}
                            className={styles.avatarImg}
                        />
                    ) : (
                        <div className={styles.avatarDefault}>
                            🐱
                        </div>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <div className={styles.username}>{userInfo.name}</div>
                    <div className={styles.userId}>ID: {userInfo.user_id}</div>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    退出登录
                </button>
            </div>

            {/* 白色内容区域 */}
            <div className={styles.contentCard}>
                {/* 统计数据区域 */}
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{followCount}</span>
                        <span className={styles.statLabel}>关注</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{likeCount}</span>
                        <span className={styles.statLabel}>点赞</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{postCount}</span>
                        <span className={styles.statLabel}>动态</span>
                    </div>
                </div>

                {/* 趣味提示区域 */}
                <div className={styles.funCard}>
                    <img src={logoCat} alt="logo" className={styles.logo} />
                    <div className={styles.funText}>
                        猫咪活动发现更多乐趣！
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileUser;
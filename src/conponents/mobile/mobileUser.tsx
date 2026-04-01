import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoCat from '../../assets/img/logo.svg'
import { removeToken } from '../../utils/token';
import styles from './mobileUser.module.css';
const MOCK_USER_INFO = {
    id: 6,
    username: "缺乏耐心的咕咕咕",
    avatar_url: "https://hhr-mqy.oss-cn-beijing.aliyuncs.com/avatars/20260310-2d267bf8220a424b8d3acb83a0dd8ac5.jpg",
    role: "USER"
};
const MOCK_STATISTICS = {
    user_id: 6,
    total_likes_received: 0,
    total_post_count: 3,
    total_following_count: 5,
    total_likes_count: 12
};
function MobileUser() {
    const navigate = useNavigate();
    // const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    // const [statistics, setStatistics] = useState<UserStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const userInfo = MOCK_USER_INFO;
    const statistics = MOCK_STATISTICS;
    // 获取用户信息和统计数据
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             // 获取用户基本信息
    //             const userRes = await userService.getUserInfo();
    //             if (userRes.code === 200 && userRes.data) {
    //                 setUserInfo(userRes.data);

    //                 // 获取用户统计数据（如果有统计接口）
    //                 try {
    //                     const statsRes = await userService.getUserStatistics(userRes.data.id);
    //                     if (statsRes.code === 200 && statsRes.data) {
    //                         setStatistics(statsRes.data);
    //                     }
    //                 } catch (statsError) {
    //                     console.error('获取用户统计数据失败:', statsError);
    //                 }
    //             } else {
    //                 // 未登录，跳转回登录页
    //                 navigate('/');
    //             }
    //         } catch (error) {
    //             console.error('获取用户信息失败:', error);
    //             navigate('/');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserData();
    // }, [navigate]);

    // 返回上一页
    const handleBack = () => {
        navigate(-1);
    };

    // 退出登录
    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    // 编辑资料（预留功能）
    const handleEditProfile = () => {
        // TODO: 跳转到编辑资料页
        console.log('编辑资料');
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
    const postCount = statistics?.total_post_count ?? 0;
    const followCount = statistics?.total_following_count ?? 0;
    const likeCount = statistics?.total_likes_count ?? 0;

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
                            alt={userInfo.username}
                            className={styles.avatarImg}
                        />
                    ) : (
                        <div className={styles.avatarDefault}>
                            🐱
                        </div>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <div className={styles.username}>{userInfo.username}</div>
                    <div className={styles.userId}>ID: {userInfo.id}</div>
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
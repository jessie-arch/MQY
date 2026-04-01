import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../service';
import { removeToken } from '../../utils/token';

function UserProfile() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await userService.getUserInfo();
                if (res.code === 200 && res.data) {
                    setUserInfo(res.data);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>;
    }

    if (!userInfo) {
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FDFAE9' }}>
            {/* 头部 */}
            <div style={{
                backgroundColor: 'var(--theme-color)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <button onClick={handleBack} style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                }}>←</button>
                <h2 style={{ margin: 0 }}>个人中心</h2>
            </div>

            {/* 用户信息 */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 16px',
                    backgroundColor: '#e4e4e4'
                }}>
                    {userInfo.avatar_url ? (
                        <img src={userInfo.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🐱</div>
                    )}
                </div>
                <h3>{userInfo.username}</h3>
                <p style={{ color: '#999' }}>{userInfo.role === 'ADMIN' ? '管理员' : '普通用户'}</p>
            </div>

            {/* 退出登录 */}
            <div style={{ padding: '20px' }}>
                <button onClick={handleLogout} style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}>
                    退出登录
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
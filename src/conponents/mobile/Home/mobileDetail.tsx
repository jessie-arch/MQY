//整个文件均由章思雨完成
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../../service';
import type { PostItem } from '../../../service';
import { NavCat } from '../../shared/navCat';
import styles from './mobileDetail.module.css';

function MobileDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const res = await postService.getPostDetail(id);
                if (res.code === 200 && res.data) {
                    setPost(res.data);
                }
            } catch (error) {
                console.error('加载详情失败:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // TODO: 调用关注接口
    };

    const handleBack = () => {
        navigate('/home');
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <NavCat />
                <div className={styles.loading}>加载中...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.container}>
                <NavCat />
                <div className={styles.error}>加载失败</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* 顶部导航栏 */}
            <div className={styles.navBar}>
                <NavCat />
                <button className={styles.backBtn} onClick={handleBack}>
                    ←
                </button>
            </div>

            {/* 滚动内容 */}
            <div className={styles.scrollContent}>
                {/* 图片区域 */}
                <div className={styles.imageSection}>
                    {post.medias && post.medias.length > 0 ? (
                        <img
                            src={post.medias[0].url}
                            alt={post.title}
                            className={styles.mainImage}
                        />
                    ) : (
                        <div className={styles.noImage}>暂无图片</div>
                    )}
                </div>

                {/* 内容区域 */}
                <div className={styles.contentSection}>
                    {/* 用户信息 */}
                    <div className={styles.userInfo}>
                        <div className={styles.avatarWrapper}>
                            {post.publisher?.avatar_url ? (
                                <img
                                    src={post.publisher.avatar_url}
                                    alt={post.publisher.username}
                                    className={styles.avatar}
                                />
                            ) : (
                                <div className={styles.avatarDefault}>
                                    {post.publisher?.username?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <div className={styles.userDetails}>
                            <div className={styles.userName}>
                                {post.publisher?.username}
                                <span className={styles.userId}>· {post.publisher?.user_id}</span>
                            </div>
                            <div className={styles.postTime}>
                                {formatDate(post.create_time)}
                            </div>
                        </div>
                        <button
                            className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? '已关注' : '+关注'}
                        </button>
                    </div>

                    {/* 猫咪标签 */}
                    <div className={styles.catTag}>
                        <span className={styles.tagIcon}>🐱</span>
                        {post.cat?.name}
                    </div>

                    {/* 标题 */}
                    <div className={styles.title}>{post.title}</div>

                    {/* 内容 */}
                    <div className={styles.content}>{post.content}</div>

                    {/* 互动区域 */}
                    <div className={styles.interaction}>
                        <div className={styles.likeInfo}>
                            <i className={`iconfont icon-aixin ${post.interaction.is_liked ? styles.liked : ''}`} />
                            <span>{post.interaction.like_count}</span>
                        </div>
                        <div className={styles.commentInfo}>
                            <i className="iconfont icon-pinglun" />
                            <span>评论</span>
                        </div>
                        <div className={styles.collectInfo}>
                            <i className="iconfont icon-shoucang" />
                            <span>收藏猫咪</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileDetail;
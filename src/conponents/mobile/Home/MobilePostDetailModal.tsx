import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, type PostDetailItem } from '../../../service/postService';
import styles from './MobilePostDetailModal.module.css';

interface MobilePostDetailModalProps {
    onClose?: () => void;
}

export const MobilePostDetailModal: React.FC<MobilePostDetailModalProps> = ({ onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetailItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchDetail = async () => {
            if (!id) {
                if (mounted) setLoading(false);
                return;
            }

            try {
                const res = await postService.getPostDetail(id);
                if (mounted && res.code === 200 && res.data) {
                    setPost(res.data);
                }
            } catch (error) {
                console.error('加载详情失败:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void fetchDetail();

        return () => {
            mounted = false;
        };
    }, [id]);

    const handleClose = () => {
        onClose?.();
        navigate('/home');
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const authorName = post?.author?.username || '未知用户';
    const authorAvatar = post?.author?.avatar_url || '';
    const likeCount = post?.stats?.like_count ?? 0;
    const isLiked = Boolean(post?.stats?.is_liked);
    const firstVideoMedia = post?.medias?.find(media => media?.media_type?.toUpperCase() === 'VIDEO');
    const firstMedia = firstVideoMedia || post?.medias?.[0];
    const isVideo = firstMedia?.media_type?.toUpperCase() === 'VIDEO';
    const mediaSource = firstMedia?.url || firstMedia?.thumbnail_url || '';
    const videoMimeType = (() => {
        if (/\.webm(\?|$)/i.test(mediaSource)) return 'video/webm';
        if (/\.ogg(\?|$)/i.test(mediaSource)) return 'video/ogg';
        return 'video/mp4';
    })();

    const handleLike = async () => {
        if (!post || liking) return;

        const previousStats = post.stats;
        const nextIsLiked = !previousStats?.is_liked;
        setLiking(true);
        setPost(prev => (
            prev
                ? {
                    ...prev,
                    stats: {
                        is_liked: nextIsLiked,
                        like_count: nextIsLiked
                            ? (prev.stats?.like_count ?? 0) + 1
                            : Math.max((prev.stats?.like_count ?? 0) - 1, 0),
                    },
                }
                : prev
        ));

        try {
            const res = previousStats?.is_liked 
                ? await postService.unlikePost(post.post_id)
                : await postService.likePost(post.post_id);
            if (res.code !== 200) {
                throw new Error(res.msg || '操作失败');
            }
        } catch (error) {
            console.error('点赞失败:', error);
            setPost(prev => (
                prev
                    ? {
                        ...prev,
                        stats: previousStats,
                    }
                    : prev
            ));
        } finally {
            setLiking(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) {
        const loadingView = (
            <div className={styles.overlay} onClick={handleBackdropClick}>
                <div className={styles.modal}>
                    <div className={styles.loading}>加载中...</div>
                </div>
            </div>
        );

        if (typeof document === 'undefined') {
            return loadingView;
        }

        return createPortal(loadingView, document.body);
    }

    if (!post) {
        const errorView = (
            <div className={styles.overlay} onClick={handleBackdropClick}>
                <div className={styles.modal}>
                    <div className={styles.error}>加载失败</div>
                </div>
            </div>
        );

        if (typeof document === 'undefined') {
            return errorView;
        }

        return createPortal(errorView, document.body);
    }

    const detailView = (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.navBar}>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        ×
                    </button>
                </div>

                {/* 滚动内容区域 */}
                <div className={styles.scrollContent}>
                    {/* 图片区域 */}
                    <div className={styles.imageSection}>
                        {mediaSource ? (
                            isVideo ? (
                                <video
                                    controls
                                    preload="metadata"
                                    playsInline
                                    poster={firstMedia?.thumbnail_url || firstMedia?.url}
                                    className={styles.mainImage}
                                >
                                    <source src={mediaSource} type={videoMimeType} />
                                    你的浏览器不支持视频播放。
                                </video>
                            ) : (
                                <img
                                    src={mediaSource}
                                    alt={post.title}
                                    className={styles.mainImage}
                                />
                            )
                        ) : (
                            <div className={styles.noImage}>暂无图片</div>
                        )}
                    </div>

                    {/* 内容区域 */}
                    <div className={styles.contentSection}>
                        {/* 用户信息 */}
                        <div className={styles.userInfo}>
                            <div className={styles.avatarWrapper}>
                                {authorAvatar ? (
                                    <img
                                        src={authorAvatar}
                                        alt={authorName}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarDefault}>
                                        {authorName?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>
                                    {authorName}
                                </div>
                                <div className={styles.postTime}>
                                    {formatDate(post.create_time)}
                                </div>
                            </div>
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
                            <div className={styles.likeInfo} onClick={handleLike} style={{ cursor: liking ? 'wait' : 'pointer' }}>
                                <i className={`iconfont icon-aixin ${isLiked ? styles.liked : ''}`} />
                                <span>{likeCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') {
        return detailView;
    }

    return createPortal(detailView, document.body);
};

export default MobilePostDetailModal;
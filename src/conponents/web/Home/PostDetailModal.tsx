import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, type PostDetailItem } from '../../../service/postService';
import styles from './PostDetailModal.module.css';

interface PostDetailModalProps {
    onClose?: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetailItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadPost = async () => {
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
                console.error('加载动态详情失败:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void loadPost();

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const authorName = post?.author?.username || '未知用户';
    const authorAvatar = post?.author?.avatar_url || '';
    const likeCount = post?.stats?.like_count ?? 0;
    const isLiked = Boolean(post?.stats?.is_liked);

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

    const modalView = loading ? (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.loading}>加载中...</div>
            </div>
        </div>
    ) : !post ? (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.error}>加载失败</div>
            </div>
        </div>
    ) : (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    ×
                </button>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        {post.medias && post.medias.length > 0 ? (
                            post.medias[0].media_type === 'VIDEO' ? (
                                <video
                                    src={post.medias[0].url || post.medias[0].thumbnail_url}
                                    controls
                                    className={styles.mainImage}
                                />
                            ) : (
                                <img
                                    src={post.medias[0].url || post.medias[0].thumbnail_url}
                                    alt={post.title}
                                    className={styles.mainImage}
                                />
                            )
                        ) : (
                            <div className={styles.noImage}>暂无图片</div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
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

                        <div className={styles.catTag}>
                            {post.cat?.name}
                        </div>

                        <div className={styles.title}>{post.title}</div>

                        <div className={styles.content}>{post.content}</div>

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
        return modalView;
    }

    return createPortal(modalView, document.body);
};

export default PostDetailModal;

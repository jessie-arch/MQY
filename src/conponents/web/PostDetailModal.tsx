import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../../service';
import type { PostItem } from '../../service';
import styles from './PostDetailModal.module.css';

interface PostDetailModalProps {
    onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                // const res = await postService.getPostDetail(id);
                // if (res.code === 200 && res.data) {
                //     setPost(res.data);
                // }
                // 临时 mock 数据，用于调试样式
                const mockData: PostItem = {
                    post_id: Number(id),
                    title: "好长的腿",
                    content: "今天带猫咪去公园散步，它好开心啊！腿真的好长，跑起来像一阵风~",
                    create_time: new Date().toISOString(),
                    publisher: {
                        user_id: 1,
                        username: "吃鱼的猫~",
                        avatar_url: "https://hhr-mqy.oss-cn-beijing.aliyuncs.com/avatars/20260310-2d267bf8220a424b8d3acb83a0dd8ac5.jpg"
                    },
                    cat: {
                        cat_id: 1,
                        name: "小花",
                        avater: ""
                    },
                    medias: [
                        {
                            media_type: "IMAGE",
                            url: "https://picsum.photos/800/600?random=1",
                            thumbnail_url: "https://picsum.photos/400/300?random=1",
                            width: 800,
                            height: 600
                        }
                    ],
                    interaction: {
                        like_count: 42,
                        is_liked: false
                    }
                };
                setPost(mockData);
            } catch (error) {
                console.error('加载详情失败:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            navigate('/home');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className={styles.overlay} onClick={handleBackdropClick}>
                <div className={styles.modal}>
                    <div className={styles.loading}>加载中...</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.overlay} onClick={handleBackdropClick}>
                <div className={styles.modal}>
                    <div className={styles.error}>加载失败</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                {/* 关闭按钮 */}
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                {/* 内容区域 */}
                <div className={styles.content}>
                    {/* 左侧图片区域 */}
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

                    {/* 右侧信息区域 */}
                    <div className={styles.infoSection}>
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
                                    <span className={styles.followBtn}>+ 关注</span>
                                </div>
                                <div className={styles.postTime}>
                                    {formatDate(post.create_time)}
                                </div>
                            </div>
                        </div>

                        {/* 猫咪标签 */}
                        <div className={styles.catTag}>
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

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
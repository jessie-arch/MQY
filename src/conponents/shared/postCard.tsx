import type { PostItem } from '../../service';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_AVATAR } from '../web/Home/webHome.constants';
import style from '../web/webHome.module.css';
import { useNavigate } from 'react-router-dom';
interface PostCardProps {
    post: PostItem;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const navigate = useNavigate();
    const firstMedia = post.medias?.[0];
    const isVideo = firstMedia?.media_type?.toUpperCase() === 'VIDEO';
    const coverImage = firstMedia?.thumbnail_url || firstMedia?.url;

    const handleCardClick = () => {
        navigate(`/home/detail/${post.post_id}`);
    };

    return (
        <div className={style.card} onClick={handleCardClick}>
            {/* 图片区域 */}
            <div className={style.imageContainer}>
                {isVideo && !firstMedia?.thumbnail_url && firstMedia?.url ? (
                    <video
                        src={firstMedia.url}
                        className={style.image}
                        muted
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <img
                        src={coverImage || PLACEHOLDER_IMAGE}
                        alt={post.title}
                        className={style.image}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                    />
                )}
            </div>

            {/* 内容区域 */}
            <div className={style.content}>
                <div className={style.title}>
                    <strong>{post.title}</strong>
                </div>

                {/* 用户信息 */}
                <div className={style.userInfo}>
                    <div className={style.avatarContainer}>
                        {post.publisher?.avatar_url ? (
                            <img
                                src={post.publisher.avatar_url}
                                alt={post.publisher.username}
                                className={style.avatarImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDER_AVATAR;
                                }}
                            />
                        ) : (
                            <div className={style.avatarImage}>
                                {post.publisher?.username?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                    <div className={style.userInfoText}>
                        <strong className={style.userName}>{post.publisher?.username}</strong>
                        <span className={style.catName}>{post.cat?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
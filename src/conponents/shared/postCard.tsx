import type { PostItem } from '../../service';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_AVATAR } from '../web/Home/webHome.constants';
import style from '../web/webHome.module.css';
import { useNavigate } from 'react-router-dom';
interface PostCardProps {
    post: PostItem;
    onLike: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/home/detail/${post.post_id}`);
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onLike(post.post_id);
    };
    return (
        <div className={style.card} onClick={handleCardClick}>
            {/* 图片区域 */}
            <div className={style.imageContainer}>
                {post.medias && post.medias.length > 0 && (
                    <img
                        src={post.medias[0].thumbnail_url}
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

                {/* 互动信息 */}
                <div className={style.interaction}>
                    <span className={style.likeInfo}>
                        <i
                            className={`iconfont icon-aixin ${post.interaction.is_liked ? style.likedIcon : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike(post.post_id);
                            }}
                        />
                        <span className={style.likeCount}>{post.interaction.like_count}</span>
                    </span>
                    <span className={post.interaction.is_liked ? style.likeStatusLiked : style.likeStatusUnliked}>
                        {post.interaction.is_liked ? '已点赞' : '点赞'}
                    </span>
                </div>
            </div>
        </div>
    );
};
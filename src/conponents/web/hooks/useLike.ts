import type { Dispatch, SetStateAction } from 'react';
import type { PostItem } from '../../../service';

export const useLike = (
    setPosts: Dispatch<SetStateAction<PostItem[]>>,
    setSearchResults: Dispatch<SetStateAction<any[]>>
) => {
    const handleLike = (postId: number) => {
        // 更新动态列表
        setPosts(prev =>
            prev.map(post =>
                post.post_id === postId
                    ? {
                        ...post,
                        interaction: {
                            ...post.interaction,
                            is_liked: !post.interaction.is_liked,
                            like_count: post.interaction.is_liked
                                ? post.interaction.like_count - 1
                                : post.interaction.like_count + 1,
                        },
                    }
                    : post
            )
        );

        // 更新搜索结果
        setSearchResults(prev =>
            prev.map((post: any) =>
                post.post_id === postId
                    ? {
                        ...post,
                        interaction: {
                            ...post.interaction,
                            is_liked: !post.interaction.is_liked,
                            like_count: post.interaction.is_liked
                                ? post.interaction.like_count - 1
                                : post.interaction.like_count + 1,
                        },
                    }
                    : post
            )
        );
    };

    return { handleLike };
};
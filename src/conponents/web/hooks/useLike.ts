import type { Dispatch, SetStateAction } from 'react';
import type { PostItem } from '../../../service';
import { postService } from '../../../service';

export const useLike = (
    setPosts: Dispatch<SetStateAction<PostItem[]>>,
    setSearchResults: Dispatch<SetStateAction<any[]>>
) => {
    const handleLike = async (postId: number) => {
        // 先获取当前点赞状态，用于决定调用哪个API
        let wasLiked = false;
        
        setPosts(prev => {
            const post = prev.find(p => p.post_id === postId);
            wasLiked = post?.interaction?.is_liked ?? false;
            
            return prev.map(post =>
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
            );
        });

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

        try {
            // 根据原来的点赞状态选择不同的API
            const res = wasLiked 
                ? await postService.unlikePost(postId)
                : await postService.likePost(postId);
            
            if (res.code !== 200) {
                throw new Error(res.msg || '操作失败');
            }
            } catch (error) {
                console.error('点赞失败:', error);
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
            }
    };

    return { handleLike };
};
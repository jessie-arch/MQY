import { request } from '../utils/myFetch';

export interface MediaItem {
    media_type: string;
    url: string;
    thumbnail_url: string;
    width: number;
    height: number;
}

export interface Publisher {
    user_id: number;
    username: string;
    avatar_url: string;
}

export interface Cat {
    cat_id: number;
    name: string;
    avater: string;
}

export interface PostItem {
    post_id: number;
    title: string;
    content: string;
    create_time: string;
    publisher: Publisher;
    cat: Cat;
    medias: MediaItem[];
    interaction: {
        like_count: number;
        is_liked: boolean;
    };
}

export interface PostsResponse {
    code: number;
    msg: string;
    data: {
        posts: PostItem[];
        next_cursor: number;
        has_more: boolean;
    };
}

export const postService = {
    // 获取动态列表
    getPosts: (cursor?: string, keyword?: string) => {
        // 构建 data 对象，只传有值的参数
        const data: any = {};
        if (cursor) data.cursor = cursor;
        if (keyword) data.keyword = keyword;

        console.log('getPosts 请求参数:', data);

        return request<PostsResponse>({
            url: '/home/posts',
            method: 'GET',
            data: Object.keys(data).length > 0 ? data : undefined
        });
    },

    // 获取动态详情
    getPostDetail: (id: string) => {
        return request<{ code: number; data: PostItem }>({
            url: `/post/detail/${id}`,
            method: 'GET',
        });
    },

    // 点赞/取消点赞
    likePost: (postId: number, isLiked: boolean) => {
        return request({
            url: `/post/${postId}/like`,
            method: 'POST',
            data: { is_liked: isLiked },
            useToken: true
        });
    },
};
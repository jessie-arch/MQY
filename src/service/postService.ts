//整个文件均由章思雨完成
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

export interface PostDetailAuthor {
    user_id: number;
    username: string;
    avatar_url: string;
}

export interface PostDetailCat {
    cat_id: number;
    name: string;
    avatar: string;
}

export interface PostDetailStats {
    is_liked: boolean;
    like_count: number;
}

export interface PostDetailItem {
    post_id: number;
    title: string;
    content: string;
    create_time: string;
    author: PostDetailAuthor;
    cat: PostDetailCat;
    medias: MediaItem[];
    stats: PostDetailStats;
}

export interface PostDetailResponse {
    code: number;
    msg: string;
    data: PostDetailItem;
}

export const postService = {
    // 获取动态列表
    getPosts: (cursor?: string, keyword?: string) => {
        const data: Record<string, string> = {};
        if (cursor) data.cursor = cursor;
        if (keyword) data.keyword = keyword;

        return request<PostsResponse>({
            url: '/home/posts',
            method: 'GET',
            data: Object.keys(data).length > 0 ? data : undefined,
        });
    },

    // 获取动态详情
    getPostDetail: (id: string | number) => {
        return request<PostDetailResponse>({
            url: `/posts/${id}`,
            method: 'GET',
            useToken: true,
        });
    },

    // 点赞
    likePost: (id: number) => {
        return request<{ code: number; msg: string; data: null }>({
            url: `/posts/like?id=${id}`,
            method: 'POST',
            useToken: true,
        });
    },

    // 取消点赞
    unlikePost: (id: number) => {
        return request<{ code: number; msg: string; data: null }>({
            url: `/posts/unlike?id=${id}`,
            method: 'POST',
            useToken: true,
        });
    },
};
//整个文件均由章思雨完成
import { request } from '../utils/myFetch';

export interface UserInfo {
    user_id: number;
    name: string;
    avatar_url: string;
    role: string;
    user_follow_count: number;
    user_like_count: number;
    user_like_received: number;
    user_post_count: number;
}

export const usersService = {

    // 获取用户信息
    getUserInfo: () => {
        return request<{ code: number; data: UserInfo }>({
            url: '/user',
            method: 'GET',
            useToken: true
        });
    },

};
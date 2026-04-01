import { request } from '../utils/myFetch';
import { getToken, setToken, removeToken } from '../utils/token';

export interface UserInfo {
    id: number;
    username: string;
    avatar_url: string;
    role: string;
}
export interface UserStatistics {
    user_id: number;
    total_likes_received: number;
    total_post_count: number;
    total_following_count: number;
    total_likes_count: number;
}

export interface UserResponse {
    code: number;
    msg: string;
    data: UserInfo;
}

export const userService = {
    // 获取当前用户信息
    getUserInfo: () => {
        return request<UserResponse>({
            url: '/user',
            method: 'GET',
            useToken: true
        });
    },
    // 获取用户统计数据
    getUserStatistics: (userId: number) => {
        return request<{ code: number; data: UserStatistics }>({
            url: `/user/${userId}/statistics`,
            method: 'GET',
            useToken: true
        });
    },

    // 检查登录状态
    checkLoginStatus: async (): Promise<boolean> => {
        const token = getToken();
        if (!token) return false;

        try {
            const res = await userService.getUserInfo();
            return res.code === 200;
        } catch {
            return false;
        }
    },

    // 退出登录
    logout: () => {
        removeToken();
    },
};
import { request } from '../utils/myFetch';
import { setToken, getToken, removeToken } from '../utils/token';

export interface UserInfo {
    user_id: number;
    username: string;
    avatar_url: string;
}

export const userService = {
    // 登录
    login: (username: string, password: string) => {
        return request<{ code: number; data: { token: string; user: UserInfo } }>({
            url: '/user/login',
            method: 'POST',
            data: { username, password }
        }).then(res => {
            if (res.code === 200 && res.data?.token) {
                setToken(res.data.token);
            }
            return res;
        });
    },

    // 注册
    register: (username: string, password: string, email?: string) => {
        return request({
            url: '/user/register',
            method: 'POST',
            data: { username, password, email }
        });
    },

    // 获取用户信息
    getUserInfo: () => {
        return request<{ code: number; data: UserInfo }>({
            url: '/user/info',
            method: 'GET',
            useToken: true
        });
    },

    // 退出登录
    logout: () => {
        removeToken();
    },

    // 是否有 token
    isLoggedIn: () => {
        return !!getToken();
    },
};
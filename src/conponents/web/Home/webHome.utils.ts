import type { GalleryCat } from '../../service';
import { CAT_STATE_MAP } from './webHome.constants.ts';

// 获取性别文字
export const getGenderText = (gender: number): string => {
    return gender === 1 ? '公' : '母';
};

// 获取状态样式类名（需要传入 style 对象）
export const getStateClass = (state: number, style: any): string => {
    return state === 1 ? style.likeStatusLiked : style.likeStatusUnliked;
};

// 获取状态文字
export const getStateText = (state: number): string => {
    return CAT_STATE_MAP[state] || '未知';
};
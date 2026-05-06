//整个文件均由章思雨完成
import { request } from '../utils/myFetch';

export interface GalleryCat {
    cat_id: number;
    name: string;
    avatar: string;
    gender: number;
    coat_color: number;
    state: number;
    position: string;
}

export interface GalleryResponse {
    code: number;
    msg: string;
    data: {
        cats: GalleryCat[];
        next_cursor: number;
        has_more: boolean;
    };
}
// 领养提交参数
export interface AdoptParams {
    cat_id: number;
    contact_info: string;
    reason: string;
    info?: string;
}

// 领养提交响应
export interface AdoptResponse {
    code: number;
    msg: string;
    data?: unknown;
}

export const catService = {
    // 获取图鉴列表
    getGallery: (cursor?: string) => {
        return request<GalleryResponse>({
            url: '/home/gallery',
            method: 'GET',
            data: cursor ? { cursor } : undefined
        });
    },

    // 获取猫咪详情
    getCatDetail: (id: string) => {
        return request<{ code: number; data: GalleryCat }>({
            url: `/cat/detail/${id}`,
            method: 'GET'
        });
    },
    // 提交领养申请
    submitAdopt: (params: AdoptParams) => {
        console.log('[submitAdopt] request params:', params);
        return request<AdoptResponse>({
            url: '/cats/adopt',
            method: 'POST',
            data: params,
            useToken: true
        })
            .then((res) => {
                console.log('[submitAdopt] response:', res);
                return res;
            })
            .catch((err) => {
                console.error('[submitAdopt] error:', err);
                throw err;
            });
    },
};
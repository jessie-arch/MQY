// src/mock/index.ts
import type { MockMethod } from 'vite-plugin-mock';

export default [
    // 动态首页接口 - GET /home/posts
    {
        url: '/home/posts',
        method: 'get',
        response: () => {
            return {
                code: 200,
                msg: "success",
                data: {
                    posts: [
                        {
                            post_id: 1008611,
                            title: "今天大橘又来蹭饭了",
                            content: "一罐猫粮瞬间见底，太能吃了...",
                            create_time: "2026-03-05 16:28:02",
                            publisher: {
                                user_id: 501,
                                username: "喵星观察员",
                                avatar_url: "https://oss.../avatar/501.jpg"
                            },
                            cat: {
                                cat_id: 201,
                                name: "大橘",
                                avatar: "https://oss.../cat/daju.jpg"
                            },
                            medias: [
                                {
                                    media_type: "IMAGE",
                                    url: "https://oss.../post/img1.jpg",
                                    thumbnail_url: "https://oss.../post/thumb1.jpg",
                                    width: 1080,
                                    height: 1440
                                }
                            ],
                            interaction: {
                                like_count: 156,
                                is_liked: true
                            }
                        },
                        {
                            post_id: 1008612,
                            title: "小花今天在阳台晒太阳",
                            content: "慵懒的午后，小花霸占了我的躺椅...",
                            create_time: "2026-03-04 14:20:15",
                            publisher: {
                                user_id: 502,
                                username: "猫奴日记",
                                avatar_url: "https://oss.../avatar/502.jpg"
                            },
                            cat: {
                                cat_id: 202,
                                name: "小花",
                                avatar: "https://oss.../cat/xiaohua.jpg"
                            },
                            medias: [
                                {
                                    media_type: "IMAGE",
                                    url: "https://oss.../post/img2.jpg",
                                    thumbnail_url: "https://oss.../post/thumb2.jpg",
                                    width: 1080,
                                    height: 1440
                                }
                            ],
                            interaction: {
                                like_count: 89,
                                is_liked: false
                            }
                        }
                    ],
                    next_cursor: 1008612,
                    has_more: true
                }
            };
        }
    },

    {
        url: '/home/gallery',
        method: 'get',
        response: () => {
            return {
                code: 200,
                msg: "success",
                data: {
                    cats: [
                        {
                            cat_id: 1000,
                            name: "大橘",
                            avatar: "https://picsum.photos/200/200?random=1",
                            gender: 1,
                            coat_color: 1,
                            state: 3,
                            position: "重庆市"
                        },
                        {
                            cat_id: 1001,
                            name: "牛奶",
                            avatar: "https://picsum.photos/200/200?random=2",
                            gender: 0,
                            coat_color: 4,
                            state: 1,
                            position: "重庆市"
                        },
                        {
                            cat_id: 1002,
                            name: "大壮",
                            avatar: "https://picsum.photos/200/200?random=3",
                            gender: 1,
                            coat_color: 1,
                            state: 3,
                            position: "重庆市"
                        },
                        {
                            cat_id: 1003,
                            name: "小牛",
                            avatar: "https://picsum.photos/200/200?random=4",
                            gender: 0,
                            coat_color: 4,
                            state: 1,
                            position: "重庆市"
                        },

                    ],
                    next_cursor: 1005,
                    has_more: true
                }
            };
        }
    },

] as MockMethod[];
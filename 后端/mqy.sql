/*
 Navicat Premium Data Transfer

 Source Server         : MySQL1
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : mqy

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 13/03/2026 14:05:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cat
-- ----------------------------
DROP TABLE IF EXISTS `cat`;
CREATE TABLE `cat`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '猫咪id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '猫咪名称',
  `avatar` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '猫咪头像',
  `gender` tinyint NOT NULL DEFAULT 0 COMMENT '性别(0 - 妹妹，1 - 弟弟)',
  `neutered_status` tinyint NOT NULL DEFAULT 0 COMMENT '绝育状态(0-未知，1-已绝育，2-未绝育)',
  `birth_date` date NOT NULL COMMENT '出生日期',
  `arrival_date` date NOT NULL COMMENT '到家日期',
  `state` tinyint NOT NULL COMMENT '状态(1-待领养，2-已被领养，3-在家，4-失踪，5-去了喵星)',
  `coat_color` tinyint NOT NULL COMMENT '毛色(1-橘猫/橘白，2-玳瑁/三花，3-纯色，4-奶牛，5-狸花/狸白，6-雀猫，7-其他)',
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '常驻地点',
  `story` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '宠物故事',
  `creator_id` bigint NOT NULL COMMENT '创建人id',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建日期',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '流浪猫动物表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cat_adopt
-- ----------------------------
DROP TABLE IF EXISTS `cat_adopt`;
CREATE TABLE `cat_adopt`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `cat_id` bigint NULL DEFAULT NULL,
  `contact_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `is_accept` tinyint NOT NULL DEFAULT 0 COMMENT '0未接受，1接接受',
  `create_time` datetime NULL DEFAULT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for followings
-- ----------------------------
DROP TABLE IF EXISTS `followings`;
CREATE TABLE `followings`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关注信息id',
  `user_id` bigint NOT NULL COMMENT '用户id',
  `cat_id` bigint NOT NULL COMMENT '宠物id',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT 1 COMMENT '状态(0关注，1取消关注)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '关注表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '动态id',
  `user_id` bigint NOT NULL COMMENT '发布者id',
  `cat_id` bigint NOT NULL COMMENT '宠物id',
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '动态文本内容',
  `like_count` bigint NOT NULL DEFAULT 0 COMMENT '点赞量',
  `create_time` datetime NULL DEFAULT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `post_cat_id_index`(`cat_id` ASC) USING BTREE,
  INDEX `post_user_id_index`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '动态表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for post_like
-- ----------------------------
DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT 1 COMMENT '0未删除，1删除',
  `create_time` datetime NULL DEFAULT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `post_like_pk`(`post_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `post_like_post_id_index`(`post_id` ASC) USING BTREE,
  INDEX `post_like_user_id_index`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for post_medias
-- ----------------------------
DROP TABLE IF EXISTS `post_medias`;
CREATE TABLE `post_medias`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '视频id',
  `post_id` bigint NOT NULL COMMENT '关联的post',
  `media_type` enum('IMAGE','VIDEO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '媒体类型',
  `url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '资源链接',
  `thumbnail_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '缩略图url',
  `width` int NOT NULL COMMENT '宽',
  `height` int NOT NULL COMMENT '高度',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `post_medias_post_id_index`(`post_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子的文本资源' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_statistics
-- ----------------------------
DROP TABLE IF EXISTS `user_statistics`;
CREATE TABLE `user_statistics`  (
  `user_id` int NOT NULL,
  `total_likes_received` bigint NOT NULL DEFAULT 0 COMMENT '收到点赞总数',
  `total_post_count` bigint NOT NULL DEFAULT 0 COMMENT '动态总数',
  `total_following_count` bigint NOT NULL DEFAULT 0 COMMENT '关注总数',
  `total_likes_count` bigint NOT NULL DEFAULT 0 COMMENT '点赞总数',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '加密后的密码\r\n',
  `avatar_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像URL',
  `role` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'USER 普通用户\r\nADMIN 管理员\r\n',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

/*
MySQL Data Transfer
Source Host: 192.168.1.4
Source Database: platform
Target Host: 192.168.1.4
Target Database: platform
Date: 2015/11/5 16:02:31
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for money
-- ----------------------------
CREATE TABLE `money` (
  `user` varchar(20) NOT NULL COMMENT '用户名',
  `gold` bigint(20) NOT NULL DEFAULT '0' COMMENT '充值币',
  PRIMARY KEY (`user`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '玩家ID',
  `user` varchar(20) NOT NULL COMMENT '玩家用户名',
  `pwd` varchar(36) NOT NULL COMMENT '密码',
  `from` varchar(64) NOT NULL DEFAULT '' COMMENT '来源',
  `token` varchar(255) NOT NULL DEFAULT '' COMMENT 'TOKEN',
  `purl` varchar(255) NOT NULL DEFAULT '' COMMENT '头像URL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`),
  KEY `id` (`id`),
  KEY `pwd` (`user`,`pwd`)
) ENGINE=InnoDB AUTO_INCREMENT=1031 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------

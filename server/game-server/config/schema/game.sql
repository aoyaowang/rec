/*
MySQL Data Transfer
Source Host: 192.168.1.4
Source Database: game
Target Host: 192.168.1.4
Target Database: game
Date: 2015/11/5 16:02:24
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for bag
-- ----------------------------
CREATE TABLE `bag` (
  `bagid` int(10) NOT NULL COMMENT '背包 ID',
  `itemid` int(10) NOT NULL COMMENT '物品 ID',
  `user` varchar(20) NOT NULL COMMENT '玩家 ID',
  `roomid` int(10) NOT NULL COMMENT '应对的房间ID',
  `place` varchar(36) NOT NULL DEFAULT '' COMMENT '位置ID 对应opentiled 里面ID',
  `num` int(10) NOT NULL DEFAULT '1' COMMENT '数量',
  `type` int(10) NOT NULL DEFAULT '0' COMMENT '类型',
  `subtype` int(10) NOT NULL DEFAULT '0' COMMENT '子类型',
  `direction` tinyint(2) NOT NULL DEFAULT '0' COMMENT '方向',
  `used` tinyint(2) NOT NULL DEFAULT '1' COMMENT '是否使用',
  KEY `bagid` (`bagid`),
  KEY `userid` (`user`),
  KEY `roomid` (`roomid`),
  KEY `itemid` (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='家园背包';

-- ----------------------------
-- Table structure for player
-- ----------------------------
CREATE TABLE `player` (
  `user` varchar(20) NOT NULL COMMENT '用户名',
  `nickname` varchar(36) NOT NULL DEFAULT '',
  `id` varchar(32) NOT NULL COMMENT 'ID:格式 平台ID_1_游戏ID_COUNT',
  `gold` bigint(20) NOT NULL DEFAULT '0' COMMENT '戏币游',
  `level` int(10) NOT NULL DEFAULT '0' COMMENT '等级',
  `type` int(10) NOT NULL DEFAULT '0' COMMENT '标示他是快速登录用户 还是 注册用户',
  `job` int(10) NOT NULL DEFAULT '0' COMMENT '职业',
  `hallid` int(10) NOT NULL DEFAULT '-1',
  `roomid` int(10) NOT NULL DEFAULT '-1',
  `lastlogintime` int(11) NOT NULL DEFAULT '0',
  `lastloginip` varchar(20) NOT NULL DEFAULT '0.0.0.0',
  PRIMARY KEY (`user`),
  KEY `user` (`user`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for room
-- ----------------------------
CREATE TABLE `room` (
  `roomid` varchar(36) NOT NULL COMMENT '房间ID = USERID_INT',
  `user` varchar(20) NOT NULL COMMENT '玩家 ID',
  `isopen` tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否开启',
  `opentiled` varchar(512) NOT NULL DEFAULT '' COMMENT '开启的空间列表',
  `endtime` int(10) NOT NULL DEFAULT '0' COMMENT '装修结束时间 时间戳',
  PRIMARY KEY (`roomid`),
  KEY `roomid` (`roomid`),
  KEY `userid` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='家园房间';

-- ----------------------------
-- Table structure for task
-- ----------------------------
CREATE TABLE `task` (
  `id` int(10) NOT NULL COMMENT '玩家任务 唯一ID',
  `taskid` int(10) NOT NULL COMMENT '任务ID',
  `user` varchar(20) NOT NULL COMMENT '玩家ID',
  `iswork` tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否开始工作',
  `begintime` int(10) NOT NULL DEFAULT '0' COMMENT '开始时间',
  `depth` int(10) NOT NULL DEFAULT '0' COMMENT '列表位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------

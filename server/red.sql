/*
Navicat MySQL Data Transfer

Source Server         : 金山云
Source Server Version : 50173
Source Host           : test.obyjd.com:3306
Source Database       : red

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2017-12-20 18:14:32
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bill
-- ----------------------------
DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill` (
  `rowid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `billid` varchar(255) NOT NULL,
  `bill` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  PRIMARY KEY (`rowid`,`billid`),
  KEY `billid` (`billid`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for daili
-- ----------------------------
DROP TABLE IF EXISTS `daili`;
CREATE TABLE `daili` (
  `rowid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `lv` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `setting` varchar(1024) NOT NULL DEFAULT '',
  PRIMARY KEY (`rowid`,`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for gamelog
-- ----------------------------
DROP TABLE IF EXISTS `gamelog`;
CREATE TABLE `gamelog` (
  `rowid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `roomid` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `coin` int(11) NOT NULL,
  `money` float(11,0) NOT NULL,
  `time` int(11) NOT NULL,
  PRIMARY KEY (`rowid`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=14276 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for liushui
-- ----------------------------
DROP TABLE IF EXISTS `liushui`;
CREATE TABLE `liushui` (
  `rowid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `value` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rowid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for money
-- ----------------------------
DROP TABLE IF EXISTS `money`;
CREATE TABLE `money` (
  `uid` bigint(20) NOT NULL,
  `money` float(20,2) NOT NULL DEFAULT '0.00',
  `fangka` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for robot
-- ----------------------------
DROP TABLE IF EXISTS `robot`;
CREATE TABLE `robot` (
  `uid` bigint(20) NOT NULL,
  `game` int(11) NOT NULL,
  `param` varchar(1024) NOT NULL DEFAULT '',
  `time1` varchar(255) NOT NULL DEFAULT '',
  `time2` varchar(255) NOT NULL DEFAULT '',
  `time3` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `r` bigint(20) NOT NULL AUTO_INCREMENT,
  `a` float(20,0) DEFAULT NULL,
  PRIMARY KEY (`r`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL DEFAULT '',
  `nickname` varchar(36) NOT NULL DEFAULT '',
  `gamename` varchar(36) NOT NULL DEFAULT '',
  `sex` tinyint(2) NOT NULL DEFAULT '1',
  `headimg` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(24) NOT NULL DEFAULT '',
  `referee` varchar(36) NOT NULL DEFAULT '',
  `vaild` int(11) NOT NULL DEFAULT '0',
  `robot` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  KEY `openid` (`openid`),
  KEY `phone` (`phone`)
) ENGINE=MyISAM AUTO_INCREMENT=100653 DEFAULT CHARSET=utf8;

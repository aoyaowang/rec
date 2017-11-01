-- -----------------------------
-- Table structure for `zswin_file`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_file`;
CREATE TABLE `zswin_file` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `name` char(30) NOT NULL DEFAULT '' COMMENT '原始文件名',
  `savename` char(20) NOT NULL DEFAULT '' COMMENT '保存名称',
  `savepath` char(30) NOT NULL DEFAULT '' COMMENT '文件保存路径',
  `ext` char(5) NOT NULL DEFAULT '' COMMENT '文件后缀',
  `mime` char(40) NOT NULL DEFAULT '' COMMENT '文件mime类型',
  `size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '文件大小',
  `md5` char(32) NOT NULL DEFAULT '' COMMENT '文件md5',
  `sha1` char(40) NOT NULL DEFAULT '' COMMENT '文件 sha1编码',
  `location` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '文件保存位置',
  `create_time` int(10) unsigned NOT NULL COMMENT '上传时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_md5` (`md5`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='文件表';
-- -----------------------------
-- Table structure for `zswin_picture`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_picture`;
CREATE TABLE `zswin_picture` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id自增',
  `path` varchar(255) NOT NULL DEFAULT '' COMMENT '路径',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '图片链接',
  `md5` char(32) NOT NULL DEFAULT '' COMMENT '文件md5',
  `sha1` char(40) NOT NULL DEFAULT '' COMMENT '文件 sha1编码',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- -----------------------------
-- Table structure for `zswin_addons`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_addons`;
CREATE TABLE `zswin_addons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(40) NOT NULL COMMENT '插件名或标识',
  `title` varchar(20) NOT NULL DEFAULT '' COMMENT '中文名',
  `description` text COMMENT '插件描述',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  `config` text COMMENT '配置',
  `author` varchar(40) DEFAULT '' COMMENT '作者',
  `version` varchar(20) DEFAULT '' COMMENT '版本号',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '安装时间',
  `has_adminlist` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否有后台列表',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COMMENT='插件表';

-- -----------------------------
-- Table structure for `zswin_hooks`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_hooks`;
CREATE TABLE `zswin_hooks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(40) NOT NULL DEFAULT '' COMMENT '钩子名称',
  `description` text NOT NULL COMMENT '描述',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '类型',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `addons` varchar(255) NOT NULL DEFAULT '' COMMENT '钩子挂载的插件 ''，''分割',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- -----------------------------
-- Table structure for `zswin_article`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_article`;
CREATE TABLE `zswin_article` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(40) NOT NULL DEFAULT '' COMMENT '标题',
  `description` text NOT NULL COMMENT '内容',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '类型',
  `status` int(11) DEFAULT '0' COMMENT '审核状态',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
   PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_dbinfo`
-- ----------------------------



DROP TABLE IF EXISTS `zswin_dbinfo`;
CREATE TABLE `zswin_dbinfo` (
`id` int(12) NOT NULL AUTO_INCREMENT,
  `userid` varchar(255) DEFAULT NULL COMMENT '身份证号',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `work` varchar(255) NOT NULL COMMENT '工作名称',
  `usertype` int(11) DEFAULT '0' COMMENT '人员类别|待业|丧失劳动能力等',
  `remark` text COMMENT '备注',
  `salary` int(11) DEFAULT '0' COMMENT '收入',
  `pos_province` int(11) NOT NULL,
  `pos_city` int(11) NOT NULL COMMENT '城市',
  `pos_district` int(11) NOT NULL COMMENT '县',
  `pos_community` int(11) NOT NULL COMMENT '乡村',
  `sex` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `birthday` int(11) NOT NULL DEFAULT '0' COMMENT '生日',
  `status` int(11) DEFAULT '0' COMMENT '资料审核状态',
  `createtime` char(30) NOT NULL COMMENT '建档时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- ----------------------------
-- Table structure for `zswin_access`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_access`;
CREATE TABLE `zswin_access` (
  `role_id` smallint(6) unsigned NOT NULL,
  `node_id` smallint(6) unsigned NOT NULL,
  `level` tinyint(1) NOT NULL,
  `pid` smallint(6) NOT NULL,
  `module` varchar(50) DEFAULT NULL,
  KEY `groupId` (`role_id`),
  KEY `nodeId` (`node_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_group`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_group`;
CREATE TABLE `zswin_group` (
  `id` smallint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `title` varchar(50) NOT NULL,
  `create_time` int(11) unsigned NOT NULL,
  `update_time` int(11) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `sort` smallint(3) unsigned NOT NULL DEFAULT '0',
  `show` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `icon` varchar(50) NOT NULL DEFAULT 'icon-bar-chart',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_node`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_node`;
CREATE TABLE `zswin_node` (
  `id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `remark` varchar(255) DEFAULT NULL,
  `sort` smallint(6) unsigned DEFAULT NULL,
  `pid` smallint(6) unsigned NOT NULL,
  `level` tinyint(1) unsigned NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `group_id` tinyint(3) unsigned DEFAULT '0',
  `icon` varchar(50) NOT NULL DEFAULT 'icon-bar-chart',
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `pid` (`pid`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=500 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_role`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_role`;
CREATE TABLE `zswin_role` (
  `id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `pid` smallint(6) DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `ename` varchar(5) DEFAULT NULL,
  `create_time` int(11) unsigned NOT NULL,
  `update_time` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parentId` (`pid`),
  KEY `ename` (`ename`),
  KEY `status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_role_user`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_role_user`;
CREATE TABLE `zswin_role_user` (
  `role_id` mediumint(9) unsigned DEFAULT NULL,
  `user_id` char(32) DEFAULT NULL,
  KEY `group_id` (`role_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_syslogs`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_syslogs`;
CREATE TABLE `zswin_syslogs` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `modulename` varchar(30) DEFAULT '',
  `actionname` varchar(30) DEFAULT '',
  `opname` varchar(30) DEFAULT '',
  `message` varchar(30) DEFAULT '',
  `userid` smallint(5) NOT NULL DEFAULT '0',
  `username` varchar(64) DEFAULT '',
  `userip` varchar(40) DEFAULT NULL,
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `zswin_user`
-- ----------------------------
DROP TABLE IF EXISTS `zswin_user`;
CREATE TABLE `zswin_user` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `account` varchar(64) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `password` char(32) NOT NULL,
  `bind_account` varchar(50) NOT NULL,
  `last_login_time` int(11) unsigned DEFAULT '0',
  `last_login_ip` varchar(40) DEFAULT NULL,
  `login_count` mediumint(8) unsigned DEFAULT '0',
  `verify` varchar(32) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `create_time` int(11) unsigned NOT NULL,
  `update_time` int(11) unsigned NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `type_id` tinyint(2) unsigned DEFAULT '0',
  `info` text NOT NULL,
  `customerid` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
--
-- 表的结构 `zswin_check_info`
--
DROP TABLE IF EXISTS `zswin_check_info`;
CREATE TABLE `zswin_check_info` (
  `uid` int(11) DEFAULT NULL,
  `con_num` int(11) DEFAULT '1',
  `total_num` int(11) DEFAULT '1',
  `ctime` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 表的结构 `zswin_support`
--
DROP TABLE IF EXISTS `zswin_support`;
CREATE TABLE `zswin_support` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appname` varchar(20) NOT NULL COMMENT '应用名',
  `row` int(11) NOT NULL COMMENT '应用标识',
  `uid` int(11) NOT NULL COMMENT '用户',
  `create_time` int(11) NOT NULL COMMENT '发布时间',
  `table` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='支持的表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `zswin_sync_login`
--
DROP TABLE IF EXISTS `zswin_sync_login`;
CREATE TABLE `zswin_sync_login` (
  `uid` int(11) NOT NULL,
  `type_uid` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `oauth_token` varchar(255) NOT NULL,
  `oauth_token_secret` varchar(255) NOT NULL,
  `is_sync` tinyint(4) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
--
-- 表的结构 `zswin_local_comment`
--
DROP TABLE IF EXISTS `zswin_local_comment`;
CREATE TABLE `zswin_local_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `app` text NOT NULL,
  `mod` text NOT NULL,
  `row_id` int(11) NOT NULL,
  `parse` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `create_time` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
--
-- 表的结构 `zswin_avatar`
--
DROP TABLE IF EXISTS `zswin_avatar`;
CREATE TABLE `zswin_avatar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `path` varchar(200) NOT NULL,
  `create_time` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `is_temp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=151 ;

-- -----------------------------
-- Table structure for `zswin_config`
-- -----------------------------
DROP TABLE IF EXISTS `zswin_config`;
CREATE TABLE `zswin_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '配置名称',
  `type` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '配置类型',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '配置说明',
  `group` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '配置分组',
  `extra` varchar(255) NOT NULL DEFAULT '' COMMENT '配置值',
  `remark` varchar(100) NOT NULL COMMENT '配置说明',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `value` text NOT NULL COMMENT '配置值',
  `sort` smallint(3) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `type` (`type`),
  KEY `group` (`group`)
) ENGINE=MyISAM AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `zswin_district`;

CREATE TABLE `zswin_district` (

  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,

  `name` varchar(255) NOT NULL DEFAULT '',

  `level` tinyint(4) unsigned NOT NULL DEFAULT '0',

  `upid` mediumint(8) unsigned NOT NULL DEFAULT '0',

  PRIMARY KEY (`id`)

) ENGINE=MyISAM AUTO_INCREMENT=45052 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='中国省市区乡镇数据表';
